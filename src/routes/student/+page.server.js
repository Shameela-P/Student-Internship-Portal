import { getCollection } from '$lib/db';
import { requireRole } from '$lib/auth';

export async function load({ cookies }) {
	const sessionUser = requireRole(cookies, ['student']);
	const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		internships: await getCollection('internships'),
		applications: await getCollection('applications')
	};
	const student = db.students.find(s => s.id === sessionUser.id);

	// 1. Fetch applications
	const studentApps = db.applications
		.filter(a => a.studentId === student.id)
		.map(app => {
			const internship = db.internships.find(i => i.id === app.internshipId);
			const company = internship ? db.companies.find(c => c.id === internship.companyId) : null;
			return {
				...app,
				internshipTitle: internship ? internship.title : 'Deleted Internship',
				domain: internship ? internship.domain : 'N/A',
				companyName: company ? company.companyName : 'Unknown Company',
				companyLogo: company ? company.companyLogo : '',
				duration: internship ? internship.duration : 'N/A',
				mode: internship ? internship.mode : 'N/A'
			};
		});

	// Sort applications: newest first
	studentApps.reverse();

	// 2. Compute Dashboard statistics
	const totalApplied = studentApps.length;
	const pendingCount = studentApps.filter(a => a.status === 'Pending' || a.status === 'Shortlisted').length;
	const approvedCount = studentApps.filter(a => a.status === 'Approved').length;
	const rejectedCount = studentApps.filter(a => a.status === 'Rejected').length;
	const certificatesCount = studentApps.filter(a => a.status === 'Approved' && a.certificateHash).length;

	// 3. Recommendation System: match student skills to active internships
	const studentSkills = student.skills.map(s => s.toLowerCase());
	
	const recommendations = db.internships
		.filter(internship => {
			// Only recommend active internships that the student hasn't applied to yet
			if (internship.status !== 'Active') return false;
			const alreadyApplied = db.applications.some(a => a.studentId === student.id && a.internshipId === internship.id);
			return !alreadyApplied;
		})
		.map(internship => {
			const company = db.companies.find(c => c.id === internship.companyId);
			
			// Exclude internships of suspended/unapproved companies
			if (!company || company.isSuspended || company.status !== 'Approved') return null;

			// Skills matching score
			const requiredSkills = internship.skillsRequired.map(s => s.toLowerCase());
			let matchedCount = 0;
			
			requiredSkills.forEach(reqSkill => {
				if (studentSkills.some(studSkill => studSkill.includes(reqSkill) || reqSkill.includes(studSkill))) {
					matchedCount++;
				}
			});

			let matchScore = 0;
			if (requiredSkills.length > 0) {
				matchScore = Math.round((matchedCount / requiredSkills.length) * 100);
			} else {
				matchScore = 50; // default baseline
			}

			// Add bonus if internship category/domain aligns with student's department or skills
			const deptMatch = student.department && internship.domain.toLowerCase().includes(student.department.toLowerCase());
			if (deptMatch) {
				matchScore += 20;
			}
			matchScore = Math.min(matchScore, 100); // Max 100

			return {
				id: internship.id,
				title: internship.title,
				domain: internship.domain,
				companyName: company.companyName,
				mode: internship.mode,
				type: internship.type,
				stipendAmount: internship.stipendAmount,
				lastDateToApply: internship.lastDateToApply,
				matchScore
			};
		})
		.filter(Boolean) // Filter out nulls
		// Sort descending by matchScore, then pick top 3
		.sort((a, b) => b.matchScore - a.matchScore)
		.slice(0, 3);

	return {
		student,
		applications: studentApps,
		stats: {
			totalApplied,
			pendingCount,
			approvedCount,
			rejectedCount,
			certificatesCount
		},
		recommendations
	};
}
