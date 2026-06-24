import { getDb, saveDb } from '$lib/db';
import { requireRole } from '$lib/auth';

export function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['company']);
	const db = getDb();
	const company = db.companies.find(c => c.id === sessionUser.id);

	// Load notifications matching company email
	const companyNotifications = db.notifications.filter(
		n => n.recipientEmail.toLowerCase() === company.companyEmail.toLowerCase()
	);

	// Mark all as read
	let changed = false;
	companyNotifications.forEach(n => {
		if (!n.read) {
			n.read = true;
			changed = true;
		}
	});

	if (changed) {
		saveDb(db);
	}

	return {
		notifications: companyNotifications
	};
}
