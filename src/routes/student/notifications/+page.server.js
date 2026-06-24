import { getDb, saveDb } from '$lib/db';
import { requireRole } from '$lib/auth';

export function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['student']);
	const db = getDb();
	const student = db.students.find(s => s.id === sessionUser.id);

	// Get notifications matching student email
	const studentNotifications = db.notifications.filter(
		n => n.recipientEmail.toLowerCase() === student.email.toLowerCase()
	);

	// Mark all as read
	let changed = false;
	studentNotifications.forEach(n => {
		if (!n.read) {
			n.read = true;
			changed = true;
		}
	});

	if (changed) {
		saveDb(db);
	}

	return {
		notifications: studentNotifications
	};
}
