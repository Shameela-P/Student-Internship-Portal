import { getDb, saveDb, logAction } from '$lib/db';
import { requireRole } from '$lib/auth';

export function load({ cookies }) {
	requireRole(cookies, ['admin']);
	const db = getDb();

	// Reverse to show newest first
	const companies = [...db.companies].reverse();

	return {
		companies
	};
}

export const actions = {
	updateStatus: async ({ request, cookies }) => {
		requireRole(cookies, ['admin']);
		const data = await request.formData();
		const companyId = data.get('companyId');
		const newStatus = data.get('status');

		const db = getDb();
		const companyIndex = db.companies.findIndex(c => c.id === companyId);
		
		if (companyIndex > -1) {
			const oldStatus = db.companies[companyIndex].status;
			db.companies[companyIndex].status = newStatus;
			
			// If suspending, also set isSuspended flag
			if (newStatus === 'Suspended') {
				db.companies[companyIndex].isSuspended = true;
			} else if (newStatus === 'Approved') {
				db.companies[companyIndex].isSuspended = false;
			}

			saveDb(db);
			logAction('UPDATE_COMPANY_STATUS', `Admin changed company ${companyId} status from ${oldStatus} to ${newStatus}`);
		}
		
		return { success: true };
	}
};
