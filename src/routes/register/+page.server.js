import { fail, redirect } from '@sveltejs/kit';
import { logAction, getCollection, updateEntireDatabase } from '$lib/db';
import { hashPassword, createToken } from '$lib/auth';
import fs from 'fs';
import path from 'path';

export async function load({ url }) {
	const role = url.searchParams.get('role') || 'student';
	return {
		role
	};
}

export const actions = {
	registerStudent: async ({ request, cookies }) => {
		const formData = await request.formData();
		
		const fullName = formData.get('fullName')?.toString().trim();
		const email = formData.get('email')?.toString().trim().toLowerCase();
		const mobileNumber = formData.get('mobileNumber')?.toString().trim();
		const password = formData.get('password')?.toString();
		const collegeName = formData.get('collegeName')?.toString().trim();
		const degreeCourse = formData.get('degreeCourse')?.toString().trim();
		const department = formData.get('department')?.toString().trim();
		const yearOfStudy = formData.get('yearOfStudy')?.toString().trim();
		const currentStatus = formData.get('currentStatus')?.toString(); // Student | Graduate
		const skillsRaw = formData.get('skills')?.toString().trim();
		const address = formData.get('address')?.toString().trim();
		const profilePhoto = formData.get('profilePhoto')?.toString().trim() || '';
		const resumeFile = formData.get('resume');

		// Basic validations
		if (!fullName || !email || !mobileNumber || !password || !collegeName || !degreeCourse || !department || !yearOfStudy || !currentStatus || !skillsRaw || !address) {
			return fail(400, { success: false, error: 'Please fill out all required student profile fields' });
		}

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		admins: await getCollection('admins'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates')
	};
		
		// Check duplicate email
		const emailUsed = db.students.some(s => s.email.toLowerCase() === email) || 
		                  db.companies.some(c => c.companyEmail.toLowerCase() === email) ||
		                  db.admins.some(a => a.email.toLowerCase() === email);
		
		if (emailUsed) {
			return fail(400, { success: false, error: 'This email is already registered on Nexora' });
		}

		// Handle file upload
		let resumePath = '';
		if (resumeFile && resumeFile instanceof File && resumeFile.size > 0) {
			const ext = path.extname(resumeFile.name) || '.pdf';
			const filename = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;
			const dest = path.resolve('uploads/resumes', filename);
			
			try {
				const buffer = Buffer.from(await resumeFile.arrayBuffer());
				fs.writeFileSync(dest, buffer);
				resumePath = filename;
			} catch (err) {
				console.error('File save error:', err);
				return fail(500, { success: false, error: 'Failed to upload resume file. Please try again.' });
			}
		} else {
			return fail(400, { success: false, error: 'A PDF/DOC resume file upload is required' });
		}

		// Format skills array
		const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

		const newStudent = {
			id: `stud_${Date.now()}`,
			fullName,
			email,
			mobileNumber,
			password: hashPassword(password),
			collegeName,
			degreeCourse,
			department,
			yearOfStudy,
			currentStatus,
			skills,
			address,
			profilePhoto,
			resumePath,
			isBlocked: false,
			createdAt: new Date().toISOString()
		};

		db.students.push(newStudent);

		// Send Automated Email Notification using template
		const template = db.emailTemplates.find(t => t.id === 'temp_student_reg');
		let subject = 'Welcome to Nexora';
		let body = `Hi ${fullName}, welcome to Nexora! Your profile has been registered.`;

		if (template) {
			subject = template.subject;
			body = template.body
				.replace('{name}', fullName)
				.replace('{degree}', degreeCourse)
				.replace('{college}', collegeName);
		}

		db.notifications.unshift({
			id: `notif_${Date.now()}`,
			recipientEmail: email,
			recipientRole: 'student',
			subject,
			body,
			date: new Date().toISOString(),
			read: false
		});

		await updateEntireDatabase(db);
		logAction('STUDENT_REGISTER', `New student ${fullName} (${email}) registered.`);

		// Log in automatically after registration
		const token = createToken({ id: newStudent.id, email: newStudent.email, name: newStudent.fullName, role: 'student' });
		cookies.set('nexora_session', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24
		});

		throw redirect(303, '/student');
	},

	registerCompany: async ({ request, cookies }) => {
		const formData = await request.formData();

		const companyName = formData.get('companyName')?.toString().trim();
		const companyEmail = formData.get('companyEmail')?.toString().trim().toLowerCase();
		const companyContactNumber = formData.get('companyContactNumber')?.toString().trim();
		const website = formData.get('website')?.toString().trim();
		const companyAddress = formData.get('companyAddress')?.toString().trim();
		const companyDescription = formData.get('companyDescription')?.toString().trim();
		const industryType = formData.get('industryType')?.toString();
		const companyLogo = formData.get('companyLogo')?.toString().trim() || '';
		const password = formData.get('password')?.toString();

		if (!companyName || !companyEmail || !companyContactNumber || !website || !companyAddress || !companyDescription || !industryType || !password) {
			return fail(400, { success: false, error: 'Please fill out all required company profile fields' });
		}

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		admins: await getCollection('admins'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates')
	};

		const emailUsed = db.students.some(s => s.email.toLowerCase() === companyEmail) || 
		                  db.companies.some(c => c.companyEmail.toLowerCase() === companyEmail) ||
		                  db.admins.some(a => a.email.toLowerCase() === companyEmail);
		
		if (emailUsed) {
			return fail(400, { success: false, error: 'This email is already registered on Nexora' });
		}

		const newCompany = {
			id: `comp_${Date.now()}`,
			companyName,
			companyEmail,
			companyContactNumber,
			website,
			companyAddress,
			companyDescription,
			industryType,
			companyLogo,
			password: hashPassword(password),
			status: 'Pending', // Requires Admin Approval
			isSuspended: false,
			createdAt: new Date().toISOString()
		};

		db.companies.push(newCompany);

		// Send Automated Email Notification using template
		const template = db.emailTemplates.find(t => t.id === 'temp_company_reg');
		let subject = 'Nexora Company Application';
		let body = `Dear HR at ${companyName}, your registration is pending review.`;

		if (template) {
			subject = template.subject;
			body = template.body.replace('{companyName}', companyName);
		}

		db.notifications.unshift({
			id: `notif_${Date.now()}`,
			recipientEmail: companyEmail,
			recipientRole: 'company',
			subject,
			body,
			date: new Date().toISOString(),
			read: false
		});

		await updateEntireDatabase(db);
		logAction('COMPANY_REGISTER', `New company ${companyName} (${companyEmail}) submitted for approval.`);

		// Log in automatically after registration
		const token = createToken({ id: newCompany.id, email: newCompany.companyEmail, name: newCompany.companyName, role: 'company' });
		cookies.set('nexora_session', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24
		});

		throw redirect(303, '/company');
	}
};
