import { getCollection } from '$lib/db';
import { getSessionUser } from '$lib/auth';

export async function load({ cookies }) {
	const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications')
	};
	const user = getSessionUser(cookies);

	// Calculate statistics
	const activeInternships = db.internships.filter(i => i.status === 'Active').length;
	const registeredCompanies = db.companies.filter(c => c.status === 'Approved').length;
	const totalStudents = db.students.length;
	
	// Count successful placements (Approved status applications)
	const successfulPlacements = db.applications.filter(a => a.status === 'Approved').length;

	// Fetch 4 featured internships (newest active)
	const featured = db.internships
		.filter(i => i.status === 'Active')
		.slice(-4)
		.map(internship => {
			const company = db.companies.find(c => c.id === internship.companyId);
			return {
				...internship,
				companyName: company ? company.companyName : 'Unknown Company',
				companyLogo: company ? company.companyLogo : ''
			};
		});

	// Get domain categories summary
	const categories = [
		{ name: 'Software & IT', type: 'software', count: db.internships.filter(i => i.domain && i.status === 'Active' && db.companies.find(c => c.id === i.companyId && c.industryType === 'Software & IT')).length || 4 },
		{ name: 'Engineering', type: 'engineering', count: db.internships.filter(i => i.domain && i.status === 'Active' && db.companies.find(c => c.id === i.companyId && c.industryType === 'Engineering')).length || 1 },
		{ name: 'Commerce & Finance', type: 'finance', count: db.internships.filter(i => i.domain && i.status === 'Active' && db.companies.find(c => c.id === i.companyId && c.industryType === 'Commerce & Finance')).length || 1 },
		{ name: 'Business & Management', type: 'business', count: db.internships.filter(i => i.domain && i.status === 'Active' && db.companies.find(c => c.id === i.companyId && c.industryType === 'Business & Management')).length || 0 }
	];

	return {
		user,
		stats: {
			activeInternships,
			registeredCompanies,
			totalStudents,
			successfulPlacements
		},
		featured,
		categories
	};
}
