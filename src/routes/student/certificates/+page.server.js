import { getDb } from '$lib/db';
import { requireRole } from '$lib/auth';

export function load({ cookies, url }) {
	const sessionUser = requireRole(cookies, ['student']);
	const db = getDb();
	const student = db.students.find(s => s.id === sessionUser.id);
	
	const hash = url.searchParams.get('hash');

	// Load all completed/archived applications for this student
	const completedApplications = db.applications.filter(a => 
		a.studentId === student.id && (a.status === 'Completed' || a.certificateHash)
	).map(app => {
		const internship = db.internships.find(i => i.id === app.internshipId);
		const company = internship ? db.companies.find(c => c.id === internship.companyId) : null;
		return {
			id: app.id,
			status: app.status,
			appliedDate: app.appliedDate,
			completionDate: app.actionDate || 'Pending Generation',
			certificateHash: app.certificateHash || '',
			internshipTitle: internship ? internship.title : 'Placement Program',
			companyName: company ? company.companyName : 'Verified Corporate Partner',
			duration: internship ? internship.duration : 'N/A'
		};
	});

	let activeCertificate = null;
	let hashError = null;

	if (hash) {
		const app = db.applications.find(a => a.certificateHash === hash);
		if (!app) {
			hashError = 'Certificate not found or is currently pending approval';
		} else if (app.studentId !== student.id) {
			hashError = 'Access denied: This credential belongs to another student profile';
		} else {
			const internship = db.internships.find(i => i.id === app.internshipId);
			const company = internship ? db.companies.find(c => c.id === internship.companyId) : null;
			activeCertificate = {
				id: app.id,
				hash: app.certificateHash,
				issueDate: app.actionDate,
				internshipTitle: internship ? internship.title : 'Placement Program',
				duration: internship ? internship.duration : 'N/A',
				companyName: company ? company.companyName : 'Verified Corporate Partner',
				companyLogo: company ? company.companyLogo : ''
			};
		}
	}

	return {
		student,
		completedApplications,
		activeCertificate,
		hashError,
		hash
	};
}
