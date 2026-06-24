import { requireRole } from '$lib/auth';
import { getDb } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['admin']);
	const db = getDb();
	const admin = db.admins.find(a => a.id === sessionUser.id);

	if (!admin) {
		cookies.delete('nexora_session', { path: '/' });
		throw redirect(303, '/login');
	}

	// Count unread messages for admin (recipientEmail is admin.email)
	const unreadMessages = db.notifications ? db.notifications.filter(
		m => m.recipientEmail === admin.email && !m.read
	).length : 0;

	return {
		user: sessionUser,
		admin,
		unreadMessages
	};
}
