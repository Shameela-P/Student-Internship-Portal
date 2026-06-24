import { logAction, getCollection, updateEntireDatabase } from '$lib/db';
import { requireRole } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['student']);
	const db = {
		students: await getCollection('students')
	};
	const student = db.students.find(s => s.id === sessionUser.id);
	return {
		student
	};
}

export const actions = {
	updateProfile: async ({ request, cookies }) => {
		const sessionUser = requireRole(cookies, ['student']);
		const formData = await request.formData();

		const fullName = formData.get('fullName')?.toString().trim();
		const mobileNumber = formData.get('mobileNumber')?.toString().trim();
		const collegeName = formData.get('collegeName')?.toString().trim();
		const degreeCourse = formData.get('degreeCourse')?.toString().trim();
		const department = formData.get('department')?.toString().trim();
		const yearOfStudy = formData.get('yearOfStudy')?.toString().trim();
		const currentStatus = formData.get('currentStatus')?.toString();
		const skillsRaw = formData.get('skills')?.toString().trim();
		const address = formData.get('address')?.toString().trim();
		const profilePhoto = formData.get('profilePhoto')?.toString().trim() || '';
		const bio = formData.get('bio')?.toString().trim() || '';

		if (!fullName || !mobileNumber || !collegeName || !degreeCourse || !department || !yearOfStudy || !currentStatus || !skillsRaw || !address) {
			return fail(400, { success: false, error: 'All fields marked with an asterisk are required' });
		}

		const db = {
		students: await getCollection('students')
	};
		const studentIndex = db.students.findIndex(s => s.id === sessionUser.id);
		if (studentIndex === -1) {
			return fail(404, { success: false, error: 'Student profile not found' });
		}

		const skills = skillsRaw.split(',').map(s => s.trim()).filter(Boolean);

		// Update fields
		db.students[studentIndex] = {
			...db.students[studentIndex],
			fullName,
			mobileNumber,
			collegeName,
			degreeCourse,
			department,
			yearOfStudy,
			currentStatus,
			skills,
			address,
			profilePhoto,
			bio
		};

		await updateEntireDatabase(db);
		logAction('STUDENT_UPDATE_PROFILE', `Student ${fullName} (${sessionUser.email}) updated profile details.`);

		return { success: true, message: 'Profile details saved successfully' };
	},

	updateResume: async ({ request, cookies }) => {
		const sessionUser = requireRole(cookies, ['student']);
		const formData = await request.formData();
		const resumeFile = formData.get('resume');

		if (!resumeFile || !(resumeFile instanceof File) || resumeFile.size === 0) {
			return fail(400, { success: false, error: 'Please select a valid PDF/DOC resume file' });
		}

		const db = {
		students: await getCollection('students')
	};
		const studentIndex = db.students.findIndex(s => s.id === sessionUser.id);
		if (studentIndex === -1) {
			return fail(404, { success: false, error: 'Student profile not found' });
		}

		const ext = path.extname(resumeFile.name) || '.pdf';
		const filename = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;
		const dest = path.resolve('uploads/resumes', filename);

		try {
			const buffer = Buffer.from(await resumeFile.arrayBuffer());
			fs.writeFileSync(dest, buffer);
			
			const oldResume = db.students[studentIndex].resumePath;
			if (oldResume && oldResume !== 'mock-resume.pdf' && oldResume !== 'mock-resume-2.pdf') {
				const oldPath = path.resolve('uploads/resumes', oldResume);
				if (fs.existsSync(oldPath)) {
					fs.unlinkSync(oldPath);
				}
			}

			db.students[studentIndex].resumePath = filename;
			await updateEntireDatabase(db);
			
			logAction('STUDENT_UPDATE_RESUME', `Student ${db.students[studentIndex].fullName} uploaded a new resume.`);
			return { success: true, message: 'Resume file updated successfully' };
		} catch (err) {
			console.error('Resume swap error:', err);
			return fail(500, { success: false, error: 'Failed to save resume. Please try again.' });
		}
	}
};
