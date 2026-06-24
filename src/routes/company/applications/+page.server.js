import { logAction, getCollection, updateEntireDatabase } from '$lib/db';
import { requireRole } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import crypto from 'crypto';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['company']);
	const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates')
	};
	const company = db.companies.find(c => c.id === sessionUser.id);

	// Fetch internships posted by this company
	const postedInternships = db.internships.filter(i => i.companyId === company.id);
	const internshipIds = new Set(postedInternships.map(i => i.id));

	// Load applications for these internships
	const applications = db.applications
		.filter(a => internshipIds.has(a.internshipId))
		.map(app => {
			const student = db.students.find(s => s.id === app.studentId);
			const internship = postedInternships.find(i => i.id === app.internshipId);
			return {
				...app,
				student: student ? {
					id: student.id,
					fullName: student.fullName,
					email: student.email,
					mobileNumber: student.mobileNumber,
					collegeName: student.collegeName,
					degreeCourse: student.degreeCourse,
					department: student.department,
					yearOfStudy: student.yearOfStudy,
					skills: student.skills,
					address: student.address,
					profilePhoto: student.profilePhoto,
					resumePath: student.resumePath
				} : null,
				internshipTitle: internship ? internship.title : 'Deleted Internship',
				domain: internship ? internship.domain : 'N/A'
			};
		});

	// Sort: newest first
	applications.reverse();

	return {
		company,
		applications
	};
}

export const actions = {
	updateStatus: async ({ request, cookies }) => {
		const sessionUser = requireRole(cookies, ['company']);
		const formData = await request.formData();
		const appId = formData.get('applicationId')?.toString();
		const newStatus = formData.get('status')?.toString(); // 'Pending' | 'Shortlisted' | 'Approved' | 'Rejected'

		if (!appId || !newStatus) {
			return fail(400, { success: false, error: 'Reference ID and Status are required' });
		}

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates')
	};
		
		// Find application and verify owner is the company
		const appIndex = db.applications.findIndex(a => a.id === appId);
		if (appIndex === -1) {
			return fail(404, { success: false, error: 'Application entry not found' });
		}

		const application = db.applications[appIndex];
		const internship = db.internships.find(i => i.id === application.internshipId);
		
		if (!internship || internship.companyId !== sessionUser.id) {
			return fail(403, { success: false, error: 'Access denied: You do not own this internship posting' });
		}

		const student = db.students.find(s => s.id === application.studentId);
		if (!student) {
			return fail(404, { success: false, error: 'Applicant student profile not found' });
		}

		// Update application details
		application.status = newStatus;
		application.actionDate = new Date().toISOString();

		// Handle Certificate Issuance & Email alerts dynamically
		if (newStatus === 'Approved') {
			// Send Automated Approved Email to Student
			const template = db.emailTemplates.find(t => t.id === 'temp_app_approved');
			let subject = 'Internship Selection';
			let body = `Dear ${student.fullName}, your application has been approved.`;

			if (template) {
				subject = template.subject.replace('{title}', internship.title);
				body = template.body
					.replace('{studentName}', student.fullName)
					.replace('{title}', internship.title)
					.replace('{companyName}', sessionUser.name)
					.replace('{studentMobile}', student.mobileNumber);
			}

			db.notifications.unshift({
				id: `notif_${Date.now()}_approved`,
				recipientEmail: student.email,
				recipientRole: 'student',
				subject,
				body,
				date: new Date().toISOString(),
				read: false
			});
			
			logAction('APPLICATION_APPROVE', `Company approved application (ID: ${appId}) for student ${student.fullName}. Certificate generated.`);
		} 
		
		else if (newStatus === 'Rejected') {
			// Send Automated Rejected Email to Student
			const template = db.emailTemplates.find(t => t.id === 'temp_app_rejected');
			let subject = 'Internship Update';
			let body = `Dear ${student.fullName}, thank you for applying, but we will not be moving forward.`;

			if (template) {
				subject = template.subject.replace('{title}', internship.title);
				body = template.body
					.replace('{studentName}', student.fullName)
					.replace('{title}', internship.title)
					.replace('{companyName}', sessionUser.name);
			}

			db.notifications.unshift({
				id: `notif_${Date.now()}_rejected`,
				recipientEmail: student.email,
				recipientRole: 'student',
				subject,
				body,
				date: new Date().toISOString(),
				read: false
			});

			logAction('APPLICATION_REJECT', `Company rejected application (ID: ${appId}) for student ${student.fullName}.`);
		} 
		
		else if (newStatus === 'Shortlisted') {
			// Send automated shortlisted alert
			db.notifications.unshift({
				id: `notif_${Date.now()}_shortlisted`,
				recipientEmail: student.email,
				recipientRole: 'student',
				subject: `Application Shortlisted: ${internship.title}`,
				body: `Dear ${student.fullName},\n\nWe are pleased to inform you that your application for "${internship.title}" has been SHORTLISTED by our hiring board.\n\nWe will review your resume in the next phase or contact you directly to schedule an interview.\n\nBest regards,\n${sessionUser.name} Recruiting Office`,
				date: new Date().toISOString(),
				read: false
			});

			logAction('APPLICATION_SHORTLIST', `Company shortlisted application (ID: ${appId}) for student ${student.fullName}.`);
		} 
		
		else {
			logAction('APPLICATION_PENDING', `Company set application (ID: ${appId}) to pending.`);
		}

		await updateEntireDatabase(db);
		return { success: true };
	},

	issueCertificate: async ({ request, cookies }) => {
		const sessionUser = requireRole(cookies, ['company']);
		const formData = await request.formData();
		const appId = formData.get('applicationId')?.toString();

		if (!appId) {
			return fail(400, { success: false, error: 'Reference ID is required' });
		}

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates')
	};
		
		const appIndex = db.applications.findIndex(a => a.id === appId);
		if (appIndex === -1) {
			return fail(404, { success: false, error: 'Application entry not found' });
		}

		const application = db.applications[appIndex];
		const internship = db.internships.find(i => i.id === application.internshipId);
		
		if (!internship || internship.companyId !== sessionUser.id) {
			return fail(403, { success: false, error: 'Access denied: You do not own this internship posting' });
		}

		if (application.status !== 'Approved') {
			return fail(400, { success: false, error: 'Application must be approved before issuing a certificate' });
		}

		if (!application.certificateHash) {
			const uniqueSeed = `${appId}_${application.studentId}_${Date.now()}`;
			application.certificateHash = `cert_${crypto.createHash('sha256').update(uniqueSeed).digest('hex').substr(0, 20)}`;
			
			// Mark internship as completed for the student
			application.status = 'Completed';

			await updateEntireDatabase(db);
			logAction('CERTIFICATE_ISSUE', `Company issued completion certificate for application (ID: ${appId}).`);
		}

		return { success: true };
	}
};
