import { requireRole } from '$lib/auth';
import { getCollection } from '$lib/db';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['admin']);
	const db = {
		admins: await getCollection('admins'),
		notifications: await getCollection('notifications')
	};
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
