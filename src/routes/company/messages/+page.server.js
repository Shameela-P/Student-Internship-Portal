import { getCollection, updateEntireDatabase } from '$lib/db';
import { requireRole } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['company']);
	const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		messages: await getCollection('messages')
	};
	const company = db.companies.find(c => c.id === sessionUser.id);

	if (!db.messages) {
		db.messages = [];
	}

	// Filter messages involving this company
	const userMessages = db.messages.filter(m => 
		m.senderEmail.toLowerCase() === company.companyEmail.toLowerCase() || 
		m.recipientEmail.toLowerCase() === company.companyEmail.toLowerCase()
	);

	// Automatically mark incoming messages as read
	let dbChanged = false;
	db.messages.forEach(m => {
		if (m.recipientEmail.toLowerCase() === company.companyEmail.toLowerCase() && !m.read) {
			m.read = true;
			dbChanged = true;
		}
	});
	if (dbChanged) {
		await updateEntireDatabase(db);
	}

	// Contacts list: Students who have applied to this company's internships + Admin Support
	const companyInternshipIds = db.internships
		.filter(i => i.companyId === company.id)
		.map(i => i.id);

	const appliedStudentIds = Array.from(
		new Set(
			db.applications
				.filter(a => companyInternshipIds.includes(a.internshipId))
				.map(a => a.studentId)
		)
	);

	const applicants = db.students
		.filter(s => appliedStudentIds.includes(s.id) && !s.isBlocked)
		.map(s => ({
			name: s.fullName,
			email: s.email,
			role: 'student'
		}));

	const contacts = [
		{ name: 'Nexora Admin Support', email: 'admin@nexora.com', role: 'admin' },
		...applicants
	];

	return {
		company,
		messages: userMessages,
		contacts
	};
}

export const actions = {
	sendMessage: async ({ request, cookies }) => {
		const sessionUser = requireRole(cookies, ['company']);
		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		messages: await getCollection('messages')
	};
		const company = db.companies.find(c => c.id === sessionUser.id);

		const formData = await request.formData();
		const recipientEmail = formData.get('recipientEmail')?.toString().trim();
		const recipientRole = formData.get('recipientRole')?.toString().trim();
		const recipientName = formData.get('recipientName')?.toString().trim();
		const content = formData.get('content')?.toString().trim();
		const attachmentFile = formData.get('attachment');

		if (!recipientEmail || !recipientRole || (!content && (!attachmentFile || attachmentFile.size === 0))) {
			return fail(400, { success: false, error: 'Recipient details or content is required' });
		}

		// Handle Attachment upload
		let attachmentPath = '';
		let attachmentType = '';
		
		if (attachmentFile && attachmentFile instanceof File && attachmentFile.size > 0) {
			const ext = path.extname(attachmentFile.name) || '.pdf';
			const filename = `attachment_${Date.now()}_${Math.random().toString(36).substr(2, 6)}${ext}`;
			const dest = path.resolve('uploads/attachments', filename);
			
			try {
				if (!fs.existsSync(path.resolve('uploads/attachments'))) {
					fs.mkdirSync(path.resolve('uploads/attachments'), { recursive: true });
				}
				const buffer = Buffer.from(await attachmentFile.arrayBuffer());
				fs.writeFileSync(dest, buffer);
				attachmentPath = filename;
				attachmentType = ext.toLowerCase() === '.pdf' ? 'resume' : 'file';
			} catch (err) {
				console.error('Company chat attachment upload error:', err);
				return fail(500, { success: false, error: 'Failed to upload attachment file' });
			}
		}

		if (!db.messages) {
			db.messages = [];
		}

		const newMessage = {
			id: `msg_${Date.now()}`,
			senderEmail: company.companyEmail,
			senderRole: 'company',
			senderName: company.companyName,
			recipientEmail,
			recipientRole,
			recipientName: recipientName || 'User',
			content: content || '',
			timestamp: new Date().toISOString(),
			read: false,
			attachmentPath,
			attachmentType
		};

		db.messages.push(newMessage);
		await updateEntireDatabase(db);

		return { success: true };
	}
};
