import { requireRole } from '$lib/auth';
import { getCollection } from '$lib/db';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['student']);
	const db = {
		students: await getCollection('students'),
		notifications: await getCollection('notifications'),
		messages: await getCollection('messages')
	};
	const student = db.students.find(s => s.id === sessionUser.id);
	
	if (!student) {
		// Just in case student was deleted/blocked since session creation
		cookies.delete('nexora_session', { path: '/' });
		throw redirect(303, '/login');
	}

	// Count unread notifications
	const unreadNotifications = db.notifications.filter(
		n => n.recipientEmail.toLowerCase() === student.email.toLowerCase() && !n.read
	).length;

	// Count unread messages
	const unreadMessages = db.messages ? db.messages.filter(
		m => m.recipientEmail === student.email && !m.read
	).length : 0;

	return {
		user: sessionUser,
		student,
		unreadNotifications,
		unreadMessages
	};
}

import { redirect } from '@sveltejs/kit';
