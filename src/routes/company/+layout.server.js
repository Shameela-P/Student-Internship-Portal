import { requireRole } from '$lib/auth';
import { getCollection } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['company']);
	const db = {
		companies: await getCollection('companies'),
		notifications: await getCollection('notifications'),
		messages: await getCollection('messages')
	};
	const company = db.companies.find(c => c.id === sessionUser.id);

	if (!company) {
		cookies.delete('nexora_session', { path: '/' });
		throw redirect(303, '/login');
	}

	if (company.isSuspended) {
		cookies.delete('nexora_session', { path: '/' });
		throw redirect(303, '/login');
	}

	const unreadNotifications = db.notifications.filter(
		n => n.recipientEmail.toLowerCase() === company.companyEmail.toLowerCase() && !n.read
	).length;

	// Count unread messages
	const unreadMessages = db.messages ? db.messages.filter(
		m => m.recipientEmail === company.companyEmail && !m.read
	).length : 0;

	return {
		user: sessionUser,
		company,
		pendingApproval: company.status === 'Pending',
		unreadNotifications,
		unreadMessages
	};
}
