import { logAction, getCollection, updateEntireDatabase } from '$lib/db';
import { requireRole } from '$lib/auth';
import { fail } from '@sveltejs/kit';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['admin']);
	const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates'),
		systemLogs: await getCollection('systemLogs')
	};

	const totalStudents = db.students.length;
	const totalCompanies = db.companies.length;
	const pendingCompanies = db.companies.filter(c => c.status === 'Pending');
	const activeInternships = db.internships.filter(i => i.status === 'Active').length;
	const totalApplications = db.applications.length;
	
	const placementsCount = db.applications.filter(a => a.status === 'Approved').length;
	const certificatesGenerated = db.applications.filter(a => a.certificateHash).length;

	// Active companies for moderation
	const activeCompanies = db.companies.filter(c => c.status === 'Approved' && !c.isSuspended).map(c => ({
		id: c.id,
		companyName: c.companyName,
		companyEmail: c.companyEmail,
		industryType: c.industryType
	}));

	// Audit Logs stream
	const logs = db.systemLogs.slice(0, 30);

	return {
		stats: {
			totalStudents,
			totalCompanies,
			pendingCompaniesCount: pendingCompanies.length,
			activeInternships,
			totalApplications,
			successfulPlacements: placementsCount,
			certificatesGenerated
		},
		verificationQueue: pendingCompanies.map(c => ({
			id: c.id,
			companyName: c.companyName,
			companyEmail: c.companyEmail,
			industryType: c.industryType,
			website: c.website,
			createdAt: c.createdAt
		})),
		activeCompanies,
		logs
	};
}

export const actions = {
	approveCompany: async ({ request, cookies }) => {
		requireRole(cookies, ['admin']);
		const formData = await request.formData();
		const companyId = formData.get('companyId')?.toString();

		if (!companyId) {
			return fail(400, { success: false, error: 'Company reference ID is missing' });
		}

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates'),
		systemLogs: await getCollection('systemLogs')
	};
		const companyIndex = db.companies.findIndex(c => c.id === companyId);
		if (companyIndex === -1) {
			return fail(404, { success: false, error: 'Company profile not found' });
		}

		db.companies[companyIndex].status = 'Approved';

		// Send email notification template
		const template = db.emailTemplates.find(t => t.id === 'temp_company_reg');
		let subject = 'Nexora Company Approval';
		let body = `Your company account ${db.companies[companyIndex].companyName} has been approved by the platform administrator.`;

		// Custom approved alert body (overwriting registration submission copy)
		subject = 'Nexora Company Profile Verified & Approved!';
		body = `Dear Recruiter at ${db.companies[companyIndex].companyName},\n\nWe are pleased to inform you that your company profile verification has completed successfully and your account is APPROVED.\n\nYou can now log in, post multiple internships, evaluate incoming candidate resumes, and issue digital completion certificates.\n\nBest regards,\nNexora Administrator Board`;

		db.notifications.unshift({
			id: `notif_${Date.now()}_comp_appr`,
			recipientEmail: db.companies[companyIndex].companyEmail,
			recipientRole: 'company',
			subject,
			body,
			date: new Date().toISOString(),
			read: false
		});

		await updateEntireDatabase(db);
		logAction('ADMIN_APPROVE_COMPANY', `Administrator approved company "${db.companies[companyIndex].companyName}" (ID: ${companyId}).`);

		return { success: true };
	},

	rejectCompany: async ({ request, cookies }) => {
		requireRole(cookies, ['admin']);
		const formData = await request.formData();
		const companyId = formData.get('companyId')?.toString();

		if (!companyId) {
			return fail(400, { success: false, error: 'Company reference ID is missing' });
		}

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates'),
		systemLogs: await getCollection('systemLogs')
	};
		const companyIndex = db.companies.findIndex(c => c.id === companyId);
		if (companyIndex === -1) {
			return fail(404, { success: false, error: 'Company profile not found' });
		}

		const compName = db.companies[companyIndex].companyName;
		const compEmail = db.companies[companyIndex].companyEmail;

		db.companies[companyIndex].status = 'Rejected';

		// Send rejection email log
		db.notifications.unshift({
			id: `notif_${Date.now()}_comp_rej`,
			recipientEmail: compEmail,
			recipientRole: 'company',
			subject: 'Nexora Company Account Rejected',
			body: `Dear Recruiter,\n\nWe regret to inform you that your application to register "${compName}" on Nexora has been declined after administrative review. We require valid corporate domains and registered structures.\n\nIf you believe this was an error, please contact support.\n\nBest regards,\nNexora Admin Board`,
			date: new Date().toISOString(),
			read: false
		});

		await updateEntireDatabase(db);
		logAction('ADMIN_REJECT_COMPANY', `Administrator rejected registration for company "${compName}" (ID: ${companyId}).`);

		return { success: true };
	},

	removeFakeCompany: async ({ request, cookies }) => {
		requireRole(cookies, ['admin']);
		const formData = await request.formData();
		const companyId = formData.get('companyId')?.toString();
		if (!companyId) return fail(400, { success: false, error: 'Missing ID' });

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates'),
		systemLogs: await getCollection('systemLogs')
	};
		const companyIndex = db.companies.findIndex(c => c.id === companyId);
		if (companyIndex === -1) return fail(404, { success: false, error: 'Not found' });

		db.companies[companyIndex].status = 'Rejected';
		db.companies[companyIndex].isSuspended = true;

		await updateEntireDatabase(db);
		logAction('ADMIN_REMOVE_FAKE_COMPANY', `Administrator suspended fake company "${db.companies[companyIndex].companyName}".`);
		return { success: true };
	},

	sendWarningEmail: async ({ request, cookies }) => {
		requireRole(cookies, ['admin']);
		const formData = await request.formData();
		const companyId = formData.get('companyId')?.toString();
		const warningMessage = formData.get('warningMessage')?.toString() || 'Please follow platform guidelines. Suspicious activity detected on your profile.';
		
		if (!companyId) return fail(400, { success: false, error: 'Missing ID' });

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications'),
		notifications: await getCollection('notifications'),
		emailTemplates: await getCollection('emailTemplates'),
		systemLogs: await getCollection('systemLogs')
	};
		const company = db.companies.find(c => c.id === companyId);
		if (!company) return fail(404, { success: false, error: 'Not found' });

		db.notifications.unshift({
			id: `notif_${Date.now()}_warning`,
			recipientEmail: company.companyEmail,
			recipientRole: 'company',
			subject: 'Admin Warning: Platform Policy Violation',
			body: warningMessage,
			date: new Date().toISOString(),
			read: false
		});

		await updateEntireDatabase(db);
		logAction('ADMIN_SEND_WARNING', `Administrator sent warning to company "${company.companyName}".`);
		return { success: true };
	}
};
