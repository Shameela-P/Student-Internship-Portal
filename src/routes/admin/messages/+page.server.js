import { getCollection, updateEntireDatabase } from '$lib/db';
import { requireRole } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['admin']);
	const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		messages: await getCollection('messages')
	};

	if (!db.messages) {
		db.messages = [];
	}

	const adminEmail = 'admin@nexora.com';

	// Filter messages involving admin
	const userMessages = db.messages.filter(m => 
		m.senderEmail.toLowerCase() === adminEmail.toLowerCase() || 
		m.recipientEmail.toLowerCase() === adminEmail.toLowerCase()
	);

	// Automatically mark incoming messages as read
	let dbChanged = false;
	db.messages.forEach(m => {
		if (m.recipientEmail.toLowerCase() === adminEmail.toLowerCase() && !m.read) {
			m.read = true;
			dbChanged = true;
		}
	});
	if (dbChanged) {
		await updateEntireDatabase(db);
	}

	// Contacts list: All approved companies + all non-blocked students
	const companies = db.companies.filter(c => c.status === 'Approved' && !c.isSuspended)
		.map(c => ({
			name: c.companyName,
			email: c.companyEmail,
			role: 'company'
		}));

	const students = db.students.filter(s => !s.isBlocked)
		.map(s => ({
			name: s.fullName,
			email: s.email,
			role: 'student'
		}));

	const contacts = [
		...companies,
		...students
	];

	return {
		messages: userMessages,
		contacts
	};
}

export const actions = {
	sendMessage: async ({ request, cookies }) => {
		const sessionUser = requireRole(cookies, ['admin']);
		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		messages: await getCollection('messages')
	};

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
				console.error('Admin chat attachment upload error:', err);
				return fail(500, { success: false, error: 'Failed to upload attachment file' });
			}
		}

		if (!db.messages) {
			db.messages = [];
		}

		const newMessage = {
			id: `msg_${Date.now()}`,
			senderEmail: 'admin@nexora.com',
			senderRole: 'admin',
			senderName: 'Nexora Admin',
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
