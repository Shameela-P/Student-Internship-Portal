import { logAction, DOMAINS, getCollection, updateEntireDatabase } from '$lib/db';
import { requireRole } from '$lib/auth';
import { fail } from '@sveltejs/kit';

export async function load({ cookies, url }) {
	const sessionUser = requireRole(cookies, ['student']);
	const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates')
	};
	const student = db.students.find(s => s.id === sessionUser.id);

	// Get filter parameters from URL query string
	const searchQuery = url.searchParams.get('query')?.toLowerCase().trim() || '';
	const filterDomain = url.searchParams.get('domain') || '';
	const filterLocation = url.searchParams.get('location')?.toLowerCase().trim() || '';
	const filterMode = url.searchParams.get('mode') || ''; // 'Online' | 'Offline' | 'Hybrid'
	const filterType = url.searchParams.get('type') || ''; // 'Free Internship' | 'Paid Internship' | 'Free + Stipend' | 'Paid + Stipend'
	const filterDuration = url.searchParams.get('duration') || '';
	const filterJobOpp = url.searchParams.get('jobOpportunity') || ''; // 'Yes' | 'No'
	const filterCert = url.searchParams.get('certificateAvailable') || ''; // 'Yes' | 'No'

	// Map company profiles for quick lookup
	const companyMap = new Map(db.companies.map(c => [c.id, c]));

	// Filter internships
	const filteredInternships = db.internships
		.filter(internship => {
			// Only show active postings
			if (internship.status !== 'Active') return false;

			const company = companyMap.get(internship.companyId);
			// Exclude unapproved or suspended company listings
			if (!company || company.isSuspended || company.status !== 'Approved') return false;

			// Search query (titles, description, skills, company name)
			if (searchQuery) {
				const titleMatch = internship.title.toLowerCase().includes(searchQuery);
				const descMatch = internship.description.toLowerCase().includes(searchQuery);
				const skillMatch = internship.skillsRequired.some(s => s.toLowerCase().includes(searchQuery));
				const companyMatch = company.companyName.toLowerCase().includes(searchQuery);
				
				if (!titleMatch && !descMatch && !skillMatch && !companyMatch) {
					return false;
				}
			}

			// Domain category filter
			if (filterDomain && internship.domain !== filterDomain) {
				return false;
			}

			// Location filter
			if (filterLocation && !internship.location.toLowerCase().includes(filterLocation)) {
				return false;
			}

			// Mode filter
			if (filterMode && internship.mode !== filterMode) {
				return false;
			}

			// Type filter
			if (filterType && internship.type !== filterType) {
				return false;
			}

			// Duration filter
			if (filterDuration && internship.duration !== filterDuration) {
				return false;
			}

			// Job opportunity after internship
			if (filterJobOpp && internship.jobOpportunity !== filterJobOpp) {
				return false;
			}

			// Certificate availability filter
			if (filterCert && internship.certificateAvailable !== filterCert) {
				return false;
			}

			return true;
		})
		.map(internship => {
			const company = companyMap.get(internship.companyId);
			const hasApplied = db.applications.some(a => a.studentId === student.id && a.internshipId === internship.id);
			
			return {
				...internship,
				companyName: company ? company.companyName : 'Unknown Company',
				companyLogo: company ? company.companyLogo : '',
				hasApplied
			};
		});

	// Guarantee minimum 15 results by relaxing some filters if necessary
	if (filteredInternships.length < 15 && (searchQuery || filterDomain || filterLocation || filterMode || filterType)) {
		const relaxedInternships = db.internships
			.filter(internship => {
				if (internship.status !== 'Active') return false;
				const company = companyMap.get(internship.companyId);
				if (!company || company.isSuspended || company.status !== 'Approved') return false;
				
				// Relax: only require partial match on query or domain
				if (searchQuery) {
					const match = internship.title.toLowerCase().includes(searchQuery) || internship.skillsRequired.some(s => s.toLowerCase().includes(searchQuery));
					if (match) return true;
				}
				if (filterDomain && internship.domain === filterDomain) return true;
				
				return false;
			})
			.map(internship => {
				const company = companyMap.get(internship.companyId);
				const hasApplied = db.applications.some(a => a.studentId === student.id && a.internshipId === internship.id);
				return { ...internship, companyName: company ? company.companyName : 'Unknown Company', companyLogo: company ? company.companyLogo : '', hasApplied };
			});
			
		// Merge unique
		const existingIds = new Set(filteredInternships.map(i => i.id));
		for (const ri of relaxedInternships) {
			if (!existingIds.has(ri.id)) {
				filteredInternships.push(ri);
			}
		}
	}

	return {
		student,
		internships: filteredInternships.slice(0, 50), // ensure we have plenty of results but not infinite
		domains: DOMAINS,
		filters: {
			query: searchQuery,
			domain: filterDomain,
			location: filterLocation,
			mode: filterMode,
			type: filterType,
			duration: filterDuration,
			jobOpportunity: filterJobOpp,
			certificateAvailable: filterCert
		}
	};
}

export const actions = {
	apply: async ({ request, cookies }) => {
		const sessionUser = requireRole(cookies, ['student']);
		const formData = await request.formData();
		const internshipId = formData.get('internshipId')?.toString();

		if (!internshipId) {
			return fail(400, { success: false, error: 'Internship reference is missing' });
		}

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates')
	};
		const student = db.students.find(s => s.id === sessionUser.id);
		const internship = db.internships.find(i => i.id === internshipId);
		
		if (!internship || internship.status !== 'Active') {
			return fail(404, { success: false, error: 'This internship is no longer active' });
		}

		const company = db.companies.find(c => c.id === internship.companyId);
		if (!company || company.isSuspended) {
			return fail(400, { success: false, error: 'The company hosting this internship has been suspended' });
		}

		// Double check duplicate application
		const alreadyApplied = db.applications.some(a => a.studentId === student.id && a.internshipId === internship.id);
		if (alreadyApplied) {
			return fail(400, { success: false, error: 'You have already applied to this internship' });
		}

		// Check if student has a resume
		if (!student.resumePath) {
			return fail(400, { success: false, error: 'You must upload a resume before applying. Update it in your Profile Settings.' });
		}

		// Create Application
		const newApp = {
			id: `app_${Date.now()}`,
			studentId: student.id,
			internshipId: internship.id,
			status: 'Pending',
			appliedDate: new Date().toISOString(),
			actionDate: '',
			resumePath: student.resumePath,
			certificateHash: ''
		};

		db.applications.push(newApp);

		// Send Automated Email to Student
		const studentTemplate = db.emailTemplates.find(t => t.id === 'temp_app_submitted');
		let studentSubject = 'Application Filed';
		let studentBody = `Hi ${student.fullName}, your application for "${internship.title}" has been submitted.`;

		if (studentTemplate) {
			studentSubject = studentTemplate.subject.replace('{title}', internship.title);
			studentBody = studentTemplate.body
				.replace('{studentName}', student.fullName)
				.replace('{title}', internship.title)
				.replace('{companyName}', company.companyName);
		}

		db.notifications.unshift({
			id: `notif_${Date.now()}_stud`,
			recipientEmail: student.email,
			recipientRole: 'student',
			subject: studentSubject,
			body: studentBody,
			date: new Date().toISOString(),
			read: false
		});

		// Send Automated Email to Company (New Application alert)
		db.notifications.unshift({
			id: `notif_${Date.now()}_comp`,
			recipientEmail: company.companyEmail,
			recipientRole: 'company',
			subject: `New Application Received: ${internship.title}`,
			body: `Dear HR Team,\n\nA new student application has been submitted for your opening: "${internship.title}".\n\nApplicant: ${student.fullName}\nCollege: ${student.collegeName}\nDepartment: ${student.department}\n\nPlease log into Nexora to review their profile and resume files.\n\nBest regards,\nNexora Recruiting Services`,
			date: new Date().toISOString(),
			read: false
		});

		await updateEntireDatabase(db);
		logAction('APPLICATION_SUBMIT', `Student ${student.fullName} applied for internship ${internship.title} (ID: ${internship.id}).`);

		return { success: true };
	}
};
