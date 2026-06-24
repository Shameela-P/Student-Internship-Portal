import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getDatabase, ref, onValue, set, child, get } from "firebase/database";
import { app } from "./firebase.js";

const database = getDatabase(app);
const dbRef = ref(database, '/');
let isFirebaseSyncing = false;
let isFirebaseInitialized = false;

const isServerless = !!(process.env.VERCEL || process.env.AWS_REGION || process.env.AWS_EXECUTION_ENV);
const DB_PATH = isServerless ? '/tmp/database.json' : path.resolve('src/lib/database.json');
const RESUMES_DIR = isServerless ? '/tmp/resumes' : path.resolve('uploads/resumes');

// Helper to ensure directories exist
try {
	if (!fs.existsSync(path.dirname(DB_PATH))) {
		fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
	}
	if (!fs.existsSync(RESUMES_DIR)) {
		fs.mkdirSync(RESUMES_DIR, { recursive: true });
	}
} catch (e) {
	console.warn('Could not create directories:', e.message);
}

// Hashing helper for seed data
function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.scryptSync(password, salt, 64).toString('hex');
	return `${salt}:${hash}`;
}

// 150+ Domains data
export const DOMAINS = [
	// Software & IT
	{ id: 1, name: 'Full Stack Development', category: 'Software & IT' },
	{ id: 2, name: 'Frontend Development', category: 'Software & IT' },
	{ id: 3, name: 'Backend Development', category: 'Software & IT' },
	{ id: 4, name: 'Mobile App Development', category: 'Software & IT' },
	{ id: 5, name: 'Android Development', category: 'Software & IT' },
	{ id: 6, name: 'iOS Development', category: 'Software & IT' },
	{ id: 7, name: 'Software Testing', category: 'Software & IT' },
	{ id: 8, name: 'Quality Assurance', category: 'Software & IT' },
	{ id: 9, name: 'Web Development', category: 'Software & IT' },
	{ id: 10, name: 'Game Development', category: 'Software & IT' },
	{ id: 11, name: 'DevOps Engineering', category: 'Software & IT' },
	{ id: 12, name: 'Cloud Computing', category: 'Software & IT' },
	{ id: 13, name: 'Cyber Security', category: 'Software & IT' },
	{ id: 14, name: 'Ethical Hacking', category: 'Software & IT' },
	{ id: 15, name: 'Blockchain Development', category: 'Software & IT' },
	{ id: 16, name: 'Internet of Things (IoT)', category: 'Software & IT' },
	{ id: 17, name: 'Embedded Systems', category: 'Software & IT' },
	{ id: 18, name: 'Artificial Intelligence', category: 'Software & IT' },
	{ id: 19, name: 'Machine Learning', category: 'Software & IT' },
	{ id: 20, name: 'Deep Learning', category: 'Software & IT' },
	{ id: 21, name: 'Data Science', category: 'Software & IT' },
	{ id: 22, name: 'Data Analytics', category: 'Software & IT' },
	{ id: 23, name: 'Business Analytics', category: 'Software & IT' },
	{ id: 24, name: 'Big Data Engineering', category: 'Software & IT' },
	{ id: 25, name: 'Database Administration', category: 'Software & IT' },
	{ id: 26, name: 'Network Administration', category: 'Software & IT' },
	{ id: 27, name: 'UI/UX Design', category: 'Software & IT' },
	{ id: 28, name: 'Product Design', category: 'Software & IT' },
	{ id: 29, name: 'AR/VR Development', category: 'Software & IT' },
	{ id: 30, name: 'Robotics', category: 'Software & IT' },

	// Engineering
	{ id: 31, name: 'Mechanical Engineering', category: 'Engineering' },
	{ id: 32, name: 'Civil Engineering', category: 'Engineering' },
	{ id: 33, name: 'Electrical Engineering', category: 'Engineering' },
	{ id: 34, name: 'Electronics Engineering', category: 'Engineering' },
	{ id: 35, name: 'Mechatronics Engineering', category: 'Engineering' },
	{ id: 36, name: 'Automobile Engineering', category: 'Engineering' },
	{ id: 37, name: 'Aerospace Engineering', category: 'Engineering' },
	{ id: 38, name: 'Industrial Engineering', category: 'Engineering' },
	{ id: 39, name: 'Manufacturing Engineering', category: 'Engineering' },
	{ id: 40, name: 'Renewable Energy Engineering', category: 'Engineering' },

	// Commerce & Finance
	{ id: 41, name: 'Accounting', category: 'Commerce & Finance' },
	{ id: 42, name: 'Auditing', category: 'Commerce & Finance' },
	{ id: 43, name: 'Finance', category: 'Commerce & Finance' },
	{ id: 44, name: 'Investment Banking', category: 'Commerce & Finance' },
	{ id: 45, name: 'Financial Analysis', category: 'Commerce & Finance' },
	{ id: 46, name: 'Taxation', category: 'Commerce & Finance' },
	{ id: 47, name: 'Banking Operations', category: 'Commerce & Finance' },
	{ id: 48, name: 'Insurance', category: 'Commerce & Finance' },
	{ id: 49, name: 'Stock Market Research', category: 'Commerce & Finance' },
	{ id: 50, name: 'Wealth Management', category: 'Commerce & Finance' },

	// Business & Management
	{ id: 51, name: 'Business Development', category: 'Business & Management' },
	{ id: 52, name: 'Human Resources', category: 'Business & Management' },
	{ id: 53, name: 'Operations Management', category: 'Business & Management' },
	{ id: 54, name: 'Project Management', category: 'Business & Management' },
	{ id: 55, name: 'Supply Chain Management', category: 'Business & Management' },
	{ id: 56, name: 'Logistics Management', category: 'Business & Management' },
	{ id: 57, name: 'Entrepreneurship', category: 'Business & Management' },
	{ id: 58, name: 'Strategic Management', category: 'Business & Management' },
	{ id: 59, name: 'Retail Management', category: 'Business & Management' },
	{ id: 60, name: 'Customer Relationship Management', category: 'Business & Management' },

	// Marketing & Sales
	{ id: 61, name: 'Digital Marketing', category: 'Marketing & Sales' },
	{ id: 62, name: 'Social Media Marketing', category: 'Marketing & Sales' },
	{ id: 63, name: 'Search Engine Optimization (SEO)', category: 'Marketing & Sales' },
	{ id: 64, name: 'Search Engine Marketing (SEM)', category: 'Marketing & Sales' },
	{ id: 65, name: 'Email Marketing', category: 'Marketing & Sales' },
	{ id: 66, name: 'Affiliate Marketing', category: 'Marketing & Sales' },
	{ id: 67, name: 'Content Marketing', category: 'Marketing & Sales' },
	{ id: 68, name: 'Brand Management', category: 'Marketing & Sales' },
	{ id: 69, name: 'Market Research', category: 'Marketing & Sales' },
	{ id: 70, name: 'Sales & Lead Generation', category: 'Marketing & Sales' },

	// Design & Creative Arts
	{ id: 71, name: 'Graphic Design', category: 'Design & Creative Arts' },
	{ id: 72, name: 'Motion Graphics', category: 'Design & Creative Arts' },
	{ id: 73, name: 'Animation', category: 'Design & Creative Arts' },
	{ id: 74, name: 'Video Editing', category: 'Design & Creative Arts' },
	{ id: 75, name: 'Photography', category: 'Design & Creative Arts' },
	{ id: 76, name: 'Cinematography', category: 'Design & Creative Arts' },
	{ id: 77, name: 'Visual Effects (VFX)', category: 'Design & Creative Arts' },
	{ id: 78, name: 'Interior Design', category: 'Design & Creative Arts' },
	{ id: 79, name: 'Fashion Design', category: 'Design & Creative Arts' },
	{ id: 80, name: 'Product Design', category: 'Design & Creative Arts' },

	// Media & Communication
	{ id: 81, name: 'Journalism', category: 'Media & Communication' },
	{ id: 82, name: 'Mass Communication', category: 'Media & Communication' },
	{ id: 83, name: 'Public Relations', category: 'Media & Communication' },
	{ id: 84, name: 'Corporate Communication', category: 'Media & Communication' },
	{ id: 85, name: 'Technical Writing', category: 'Media & Communication' },
	{ id: 86, name: 'Content Writing', category: 'Media & Communication' },
	{ id: 87, name: 'Copywriting', category: 'Media & Communication' },
	{ id: 88, name: 'Blogging', category: 'Media & Communication' },
	{ id: 89, name: 'Podcast Production', category: 'Media & Communication' },
	{ id: 90, name: 'Broadcasting', category: 'Media & Communication' },

	// Healthcare & Medical
	{ id: 91, name: 'Nursing', category: 'Healthcare & Medical' },
	{ id: 92, name: 'Pharmacy', category: 'Healthcare & Medical' },
	{ id: 93, name: 'Physiotherapy', category: 'Healthcare & Medical' },
	{ id: 94, name: 'Medical Coding', category: 'Healthcare & Medical' },
	{ id: 95, name: 'Clinical Research', category: 'Healthcare & Medical' },
	{ id: 96, name: 'Healthcare Administration', category: 'Healthcare & Medical' },
	{ id: 97, name: 'Public Health', category: 'Healthcare & Medical' },
	{ id: 98, name: 'Nutrition & Dietetics', category: 'Healthcare & Medical' },
	{ id: 99, name: 'Medical Laboratory Technology', category: 'Healthcare & Medical' },
	{ id: 100, name: 'Hospital Management', category: 'Healthcare & Medical' },

	// Education & Research
	{ id: 101, name: 'Teaching Assistant', category: 'Education & Research' },
	{ id: 102, name: 'Educational Technology', category: 'Education & Research' },
	{ id: 103, name: 'Academic Research', category: 'Education & Research' },
	{ id: 104, name: 'Curriculum Development', category: 'Education & Research' },
	{ id: 105, name: 'E-Learning Development', category: 'Education & Research' },

	// Arts, Literature & Languages
	{ id: 106, name: 'Tamil Literature', category: 'Arts, Literature & Languages' },
	{ id: 107, name: 'English Literature', category: 'Arts, Literature & Languages' },
	{ id: 108, name: 'Hindi Literature', category: 'Arts, Literature & Languages' },
	{ id: 109, name: 'Linguistics', category: 'Arts, Literature & Languages' },
	{ id: 110, name: 'Translation Services', category: 'Arts, Literature & Languages' },
	{ id: 111, name: 'Creative Writing', category: 'Arts, Literature & Languages' },

	// Social Sciences
	{ id: 112, name: 'History', category: 'Social Sciences' },
	{ id: 113, name: 'Geography', category: 'Social Sciences' },
	{ id: 114, name: 'Political Science', category: 'Social Sciences' },
	{ id: 115, name: 'Sociology', category: 'Social Sciences' },
	{ id: 116, name: 'Psychology', category: 'Social Sciences' },
	{ id: 117, name: 'Anthropology', category: 'Social Sciences' },
	{ id: 118, name: 'Economics', category: 'Social Sciences' },

	// Law & Governance
	{ id: 119, name: 'Legal Research', category: 'Law & Governance' },
	{ id: 120, name: 'Corporate Law', category: 'Law & Governance' },
	{ id: 121, name: 'Intellectual Property Rights', category: 'Law & Governance' },
	{ id: 122, name: 'Compliance Management', category: 'Law & Governance' },
	{ id: 123, name: 'Public Administration', category: 'Law & Governance' },

	// Agriculture & Environment
	{ id: 124, name: 'Agriculture', category: 'Agriculture & Environment' },
	{ id: 125, name: 'Agribusiness', category: 'Agriculture & Environment' },
	{ id: 126, name: 'Horticulture', category: 'Agriculture & Environment' },
	{ id: 127, name: 'Environmental Science', category: 'Agriculture & Environment' },
	{ id: 128, name: 'Sustainability Studies', category: 'Agriculture & Environment' },
	{ id: 129, name: 'Forestry', category: 'Agriculture & Environment' },
	{ id: 130, name: 'Wildlife Conservation', category: 'Agriculture & Environment' },

	// Hospitality & Tourism
	{ id: 131, name: 'Hotel Management', category: 'Hospitality & Tourism' },
	{ id: 132, name: 'Tourism Management', category: 'Hospitality & Tourism' },
	{ id: 133, name: 'Travel Operations', category: 'Hospitality & Tourism' },
	{ id: 134, name: 'Event Management', category: 'Hospitality & Tourism' },
	{ id: 135, name: 'Culinary Arts', category: 'Hospitality & Tourism' },

	// Emerging Domains
	{ id: 136, name: 'Generative AI', category: 'Emerging Domains' },
	{ id: 137, name: 'Prompt Engineering', category: 'Emerging Domains' },
	{ id: 138, name: 'AI Automation', category: 'Emerging Domains' },
	{ id: 139, name: 'Low-Code Development', category: 'Emerging Domains' },
	{ id: 140, name: 'No-Code Development', category: 'Emerging Domains' },
	{ id: 141, name: 'Quantum Computing', category: 'Emerging Domains' },
	{ id: 142, name: 'Digital Transformation', category: 'Emerging Domains' },
	{ id: 143, name: 'Smart City Technologies', category: 'Emerging Domains' },
	{ id: 144, name: 'Green Technology', category: 'Emerging Domains' },
	{ id: 145, name: 'Space Technology', category: 'Emerging Domains' },

	// Government & Public Services
	{ id: 146, name: 'E-Governance', category: 'Government & Public Services' },
	{ id: 147, name: 'Rural Development', category: 'Government & Public Services' },
	{ id: 148, name: 'Urban Planning', category: 'Government & Public Services' },
	{ id: 149, name: 'Public Policy', category: 'Government & Public Services' },
	{ id: 150, name: 'Social Work', category: 'Government & Public Services' }
];

const DEFAULT_DB = {
	students: [
		{
			id: 'stud_1',
			fullName: 'John Doe',
			email: 'john@example.com',
			mobileNumber: '9876543210',
			password: hashPassword('student123'),
			collegeName: 'Harvard University',
			degreeCourse: 'Bachelor of Science',
			department: 'Computer Science',
			yearOfStudy: '3',
			currentStatus: 'Student',
			skills: ['Full Stack Development', 'Frontend Development', 'React', 'Node.js'],
			address: '123 University Ave, Boston, MA',
			profilePhoto: '',
			resumePath: 'mock-resume.pdf',
			isBlocked: false,
			createdAt: new Date('2026-05-01').toISOString()
		},
		{
			id: 'stud_2',
			fullName: 'Jane Smith',
			email: 'jane@example.com',
			mobileNumber: '9876543211',
			password: hashPassword('student123'),
			collegeName: 'Stanford University',
			degreeCourse: 'Master of Science',
			department: 'Data Science',
			yearOfStudy: '2',
			currentStatus: 'Student',
			skills: ['Data Science', 'Machine Learning', 'Python', 'SQL'],
			address: '456 Tech Drive, Palo Alto, CA',
			profilePhoto: '',
			resumePath: 'mock-resume-2.pdf',
			isBlocked: false,
			createdAt: new Date('2026-05-05').toISOString()
		}
	],
	companies: [
		{
			id: 'comp_1',
			companyName: 'TechNova Solutions',
			companyEmail: 'contact@technova.com',
			companyContactNumber: '9988776655',
			website: 'https://technova.com',
			companyAddress: 'Innovators Bay, Seattle, WA',
			companyDescription: 'Pioneering next-generation enterprise software solutions.',
			industryType: 'Software & IT',
			companyLogo: '',
			password: hashPassword('company123'),
			status: 'Approved', // Approved, Pending, Rejected
			isSuspended: false,
			createdAt: new Date('2026-04-10').toISOString()
		},
		{
			id: 'comp_2',
			companyName: 'InnovateLab Engineering',
			companyEmail: 'jobs@innovatelab.com',
			companyContactNumber: '9988776656',
			website: 'https://innovatelab.com',
			companyAddress: '42 Mechanics Way, Detroit, MI',
			companyDescription: 'Leading design agency specializing in renewable energy systems and mechatronics.',
			industryType: 'Engineering',
			companyLogo: '',
			password: hashPassword('company123'),
			status: 'Approved',
			isSuspended: false,
			createdAt: new Date('2026-04-12').toISOString()
		},
		{
			id: 'comp_3',
			companyName: 'FinSmart Holdings',
			companyEmail: 'hr@finsmart.com',
			companyContactNumber: '9988776657',
			website: 'https://finsmart.com',
			companyAddress: 'Wall St Suite 101, New York, NY',
			companyDescription: 'Boutique financial consulting firm supporting emerging tech start-ups.',
			industryType: 'Commerce & Finance',
			companyLogo: '',
			password: hashPassword('company123'),
			status: 'Approved',
			isSuspended: false,
			createdAt: new Date('2026-04-15').toISOString()
		},
		{
			id: 'comp_4',
			companyName: 'Apex Business Corp',
			companyEmail: 'recruit@apexcorp.com',
			companyContactNumber: '9988776658',
			website: 'https://apexcorp.com',
			companyAddress: 'Commerce Plaza, Chicago, IL',
			companyDescription: 'A global logistics and supply chain consultancy.',
			industryType: 'Business & Management',
			companyLogo: '',
			password: hashPassword('company123'),
			status: 'Pending', // Pending admin approval
			isSuspended: false,
			createdAt: new Date('2026-06-15').toISOString()
		},
		{
			id: 'comp_5',
			companyName: 'Fake Fraud Co',
			companyEmail: 'info@fakefraud.com',
			companyContactNumber: '9000000000',
			website: 'https://fakefraud.com',
			companyAddress: 'Unknown Street, Hidden City',
			companyDescription: 'Get rich quick schemes and fake postings.',
			industryType: 'Emerging Domains',
			companyLogo: '',
			password: hashPassword('company123'),
			status: 'Approved',
			isSuspended: true, // Blocked/Suspended by Admin
			createdAt: new Date('2026-05-20').toISOString()
		}
	],
	internships: [
		{
			id: 'intern_1',
			companyId: 'comp_1',
			title: 'Full Stack Web Developer Intern',
			domain: 'Full Stack Development',
			skillsRequired: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
			description: 'Work with our frontend and backend teams to build real-world client dashboards. You will learn modern database engineering, scalable API designs, and premium Svelte/React user interface structures.',
			learningOutcomes: 'Gain end-to-end expertise in full-stack architecture, RESTful API practices, database migrations, and responsive Tailwind styling.',
			duration: '3 Months',
			startDate: '2026-07-01',
			lastDateToApply: '2026-06-30',
			mode: 'Online', // Online, Offline, Hybrid
			type: 'Free + Stipend', // Free, Paid, Free + Stipend, Paid + Stipend
			fee: 0,
			stipendAmount: 8000,
			openings: 5,
			location: 'Remote',
			certificateAvailable: 'Yes',
			jobOpportunity: 'Yes',
			status: 'Active', // Active, Closed, Archived
			createdAt: new Date('2026-05-15').toISOString()
		},
		{
			id: 'intern_2',
			companyId: 'comp_1',
			title: 'UI/UX Interface Designer',
			domain: 'UI/UX Design',
			skillsRequired: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
			description: 'Create user journeys, wireframes, and high-fidelity mockups for our mobile apps. Collaborate directly with engineers to ensure pixel-perfect CSS execution.',
			learningOutcomes: 'Master wireframing tools, create comprehensive design systems, and run remote usability audits.',
			duration: '6 Months',
			startDate: '2026-07-15',
			lastDateToApply: '2026-07-05',
			mode: 'Hybrid',
			type: 'Paid + Stipend',
			fee: 1500,
			stipendAmount: 15000,
			openings: 2,
			location: 'Seattle, WA',
			certificateAvailable: 'Yes',
			jobOpportunity: 'Yes',
			status: 'Active',
			createdAt: new Date('2026-05-18').toISOString()
		},
		{
			id: 'intern_3',
			companyId: 'comp_2',
			title: 'CAD & Mechanical Systems Design',
			domain: 'Mechanical Engineering',
			skillsRequired: ['SolidWorks', 'AutoCAD', 'Finite Element Analysis'],
			description: 'Design components for renewable energy wind turbines. Model stresses and analyze structural safety parameters.',
			learningOutcomes: 'Understand commercial manufacturing specifications, stress analysis simulation tools, and material science selections.',
			duration: '6 Months',
			startDate: '2026-08-01',
			lastDateToApply: '2026-07-20',
			mode: 'Offline',
			type: 'Paid',
			fee: 2500, // Internship fee
			stipendAmount: 0,
			openings: 3,
			location: 'Detroit, MI',
			certificateAvailable: 'Yes',
			jobOpportunity: 'No',
			status: 'Active',
			createdAt: new Date('2026-05-20').toISOString()
		},
		{
			id: 'intern_4',
			companyId: 'comp_3',
			title: 'Stock Market Analyst Intern',
			domain: 'Financial Analysis',
			skillsRequired: ['Excel VBA', 'Financial Modeling', 'R Language'],
			description: 'Conduct quantitative research on sector stocks. Formulate weekly portfolio briefings for internal fund managers.',
			learningOutcomes: 'Deepen knowledge in discounted cash flows (DCF), stock valuations, options pricing, and market risks.',
			duration: '4 Months',
			startDate: '2026-07-10',
			lastDateToApply: '2026-06-25',
			mode: 'Hybrid',
			type: 'Free + Stipend',
			fee: 0,
			stipendAmount: 12000,
			openings: 4,
			location: 'New York, NY',
			certificateAvailable: 'Yes',
			jobOpportunity: 'Yes',
			status: 'Active',
			createdAt: new Date('2026-05-22').toISOString()
		},
		{
			id: 'intern_5',
			companyId: 'comp_5',
			title: 'Fraudulent Blockchain Scheme Intern',
			domain: 'Blockchain Development',
			skillsRequired: ['Bitcoin', 'Crypto Mining'],
			description: 'Help mine shitcoins on mock testnets. (This company will be suspended, marking the post inactive).',
			learningOutcomes: 'None.',
			duration: '1 Month',
			startDate: '2026-06-01',
			lastDateToApply: '2026-06-15',
			mode: 'Online',
			type: 'Paid',
			fee: 6500,
			stipendAmount: 0,
			openings: 10,
			location: 'Remote',
			certificateAvailable: 'No',
			jobOpportunity: 'No',
			status: 'Active',
			createdAt: new Date('2026-05-15').toISOString()
		},
		{
			id: 'intern_6',
			companyId: 'comp_1',
			title: 'Expired Frontend Intern',
			domain: 'Frontend Development',
			skillsRequired: ['HTML', 'CSS', 'JavaScript'],
			description: 'This is a mock internship that is already expired to test the automated expiry checker.',
			learningOutcomes: 'Learn JavaScript basics.',
			duration: '2 Months',
			startDate: '2026-06-01',
			lastDateToApply: '2026-05-15', // Past date (Local current date is 2026-06-17)
			mode: 'Online',
			type: 'Free',
			fee: 0,
			stipendAmount: 0,
			openings: 2,
			location: 'Remote',
			certificateAvailable: 'Yes',
			jobOpportunity: 'No',
			status: 'Active', // Loaded as Active, but checker should flag it as Closed
			createdAt: new Date('2026-04-01').toISOString()
		}
	],
	applications: [
		{
			id: 'app_1',
			studentId: 'stud_1',
			internshipId: 'intern_1',
			status: 'Approved', // Pending, Shortlisted, Approved, Rejected
			appliedDate: new Date('2026-05-16').toISOString(),
			actionDate: new Date('2026-05-20').toISOString(),
			resumePath: 'mock-resume.pdf',
			certificateHash: 'cert_7f8a9b2c3d4e5f6g7h8i9j'
		},
		{
			id: 'app_2',
			studentId: 'stud_2',
			internshipId: 'intern_1',
			status: 'Pending',
			appliedDate: new Date('2026-05-17').toISOString(),
			actionDate: '',
			resumePath: 'mock-resume-2.pdf',
			certificateHash: ''
		},
		{
			id: 'app_3',
			studentId: 'stud_1',
			internshipId: 'intern_2',
			status: 'Shortlisted',
			appliedDate: new Date('2026-05-20').toISOString(),
			actionDate: new Date('2026-05-22').toISOString(),
			resumePath: 'mock-resume.pdf',
			certificateHash: ''
		}
	],
	admins: [
		{
			id: 'admin_1',
			email: 'admin@nexora.com',
			fullName: 'Nexora Super Admin',
			password: hashPassword('admin123')
		}
	],
	notifications: [
		{
			id: 'notif_1',
			recipientEmail: 'john@example.com',
			recipientRole: 'student',
			subject: 'Welcome to Nexora!',
			body: 'Hi John Doe, your student profile registration was successful. Start exploring available internships in your dashboard!',
			date: new Date('2026-05-01T10:00:00Z').toISOString(),
			read: true
		},
		{
			id: 'notif_2',
			recipientEmail: 'contact@technova.com',
			recipientRole: 'company',
			subject: 'Company Account Approved',
			body: 'Welcome TechNova Solutions! Your company account has been verified by the Nexora administrator. You can now post internships and recruit talent.',
			date: new Date('2026-04-11T12:00:00Z').toISOString(),
			read: true
		},
		{
			id: 'notif_3',
			recipientEmail: 'john@example.com',
			recipientRole: 'student',
			subject: 'Internship Application Approved!',
			body: 'Congratulations John Doe! Your application for the "Full Stack Web Developer Intern" at TechNova Solutions has been Approved. Your digital completion certificate has been generated and is ready to view under the Certificates tab.',
			date: new Date('2026-05-20T14:30:00Z').toISOString(),
			read: false
		}
	],
	emailTemplates: [
		{
			id: 'temp_student_reg',
			name: 'Student Registration Success',
			subject: 'Welcome to Nexora - Start Your Internship Journey!',
			body: 'Hi {name},\n\nWelcome to Nexora! Your account registration as a student has been completed successfully.\n\nAcademic Details:\nDegree: {degree}\nCollege: {college}\n\nYou can now browse over 150 domain categories and apply for internships. Make sure to complete your profile skills and keep your resume updated to attract top recruiters.\n\nBest regards,\nNexora Admin Team'
		},
		{
			id: 'temp_company_reg',
			name: 'Company Registration Submitted',
			subject: 'Company Account Pending Approval - Nexora',
			body: 'Dear HR Team at {companyName},\n\nThank you for registering on Nexora. Your application is currently pending administrator verification. We review credentials to maintain platform safety.\n\nOnce approved, you will receive an confirmation email and can start posting internships immediately.\n\nBest regards,\nNexora Admin Team'
		},
		{
			id: 'temp_app_submitted',
			name: 'Student Application Submitted',
			subject: 'Application Filed for {title}',
			body: 'Dear {studentName},\n\nThis is to confirm that you have successfully applied for the internship: "{title}" at {companyName}.\n\nYour application status is currently: PENDING. The hiring manager has been notified and will review your profile and resume.\n\nYou can track the application state directly on your dashboard.\n\nBest regards,\nNexora Platform Services'
		},
		{
			id: 'temp_app_approved',
			name: 'Application Approved (Hired)',
			subject: 'Congratulations! You are selected for {title}',
			body: 'Dear {studentName},\n\nGreat news! The hiring manager at {companyName} has reviewed your profile and APPROVED your application for: "{title}".\n\nNext Steps:\nThe company will contact you at {studentMobile} or via email to share onboarding instructions and start dates.\n\nGood luck with your internship!\n\nBest regards,\nNexora Team'
		},
		{
			id: 'temp_app_rejected',
			name: 'Application Rejected',
			subject: 'Update regarding your application for {title}',
			body: 'Dear {studentName},\n\nThank you for your interest in the "{title}" internship at {companyName}.\n\nAfter carefully reviewing all applications, we regret to inform you that we will not be moving forward with your candidacy for this position. We encourage you to apply for other opportunities in your recommended domain list.\n\nBest of luck in your search!\n\nBest regards,\n{companyName} Recruiting Team'
		},
		{
			id: 'temp_fraud_alert',
			name: 'Fraudulent Company Deactivation Warning',
			subject: 'CRITICAL WARNING: Company {companyName} flagged as FRAUDULENT',
			body: 'Dear Student,\n\nWe are writing to warn you that the company "{companyName}" has been detected and flagged as Fraudulent or in violation of safety guidelines by our administrative board.\n\nTheir listings have been disabled. If you have had financial transactions or shared confidential documents with this company, please take immediate precautions.\n\nNexora prioritizes your safety. Thank you for your cooperation.\n\nBest regards,\nNexora Admin Security Office'
		},
		{
			id: 'temp_offer_revoked',
			name: 'Internship Offer Revoked Warning',
			subject: 'URGENT: Offer Revoked for {title}',
			body: 'Dear {studentName},\n\nWe regret to inform you that your accepted offer for the "{title}" internship has been revoked by {companyName} due to unforeseen circumstances.\n\nPlease log in to your dashboard to view detailed feedback or apply for alternative positions.\n\nBest regards,\nNexora Support Team'
		},
		{
			id: 'temp_student_newsletter',
			name: 'Weekly Student Newsletter',
			subject: 'Top Internships of the Week - Nexora!',
			body: 'Hi {name},\n\nCheck out the most highly-rated internships added this week in your domains of interest!\n\nLog in to Nexora to apply to these top tier companies before the deadline.\n\nBest regards,\nNexora Team'
		},
		{
			id: 'temp_company_profile_update',
			name: 'Company Profile Update Confirmation',
			subject: 'Profile Updated Successfully - Nexora',
			body: 'Dear {companyName},\n\nYour company profile information has been successfully updated on the Nexora Platform.\n\nIf you did not authorize these changes, please contact support immediately.\n\nBest regards,\nNexora Admin Team'
		}
	],
	systemLogs: [
		{
			id: 'log_1',
			action: 'SYSTEM_STARTUP',
			details: 'Database seeded with 150 domains, 5 mock companies, and 2 default students.',
			timestamp: new Date().toISOString()
		}
	]
};

// Dynamic Seeding Helper
function seedDatabase(db) {
	console.log('Seeding database with demo data...');

	const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Arav', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Pranav', 'Karan', 'Kabir', 'Rohan', 'Rahul', 'Ananya', 'Diya', 'Pari', 'Pihu', 'Ira', 'Avani', 'Myra', 'Aadhya', 'Saanvi', 'Anika', 'Aisha', 'Riya', 'Sara', 'Neha', 'Pooja', 'Shruti', 'Deepika', 'Kareena', 'Priyanka', 'Katrina', 'Alia', 'Kiara', 'Janhvi'];
	const lastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Kumar', 'Singh', 'Nair', 'Pillai', 'Rao', 'Joshi', 'Mehra', 'Kapoor', 'Khan', 'Deshmukh', 'Kulkarni', 'Bose', 'Chatterjee', 'Sen', 'Das', 'Roy', 'Chawla', 'Bhasin', 'Malhotra', 'Suri', 'Grover', 'Trivedi', 'Pandey', 'Mishra', 'Yadav', 'Prasad', 'Raman', 'Swamy', 'Iyer', 'Iyengar'];

	const colleges = [
		'Indian Institute of Technology Madras',
		'Indian Institute of Technology Bombay',
		'Indian Institute of Technology Delhi',
		'Indian Institute of Science Bangalore',
		'National Institute of Technology Trichy',
		'BITS Pilani',
		'Delhi Technological University',
		'Vellore Institute of Technology',
		'SRM Institute of Science and Technology',
		'Anna University Chennai',
		'PSG College of Technology',
		'Amrita Vishwa Vidyapeetham',
		'Manipal Institute of Technology',
		'RV College of Engineering',
		'Jadavpur University'
	];

	const degreeCourses = [
		'Bachelor of Technology',
		'Bachelor of Engineering',
		'Master of Technology',
		'Master of Science',
		'Bachelor of Science',
		'Master of Computer Applications',
		'Bachelor of Computer Applications',
		'Bachelor of Commerce',
		'Master of Commerce'
	];

	const departments = [
		'Computer Science and Engineering',
		'Information Technology',
		'Software Engineering',
		'Electronics and Communication Engineering',
		'Electrical and Electronics Engineering',
		'Mechanical Engineering',
		'Data Science',
		'Artificial Intelligence',
		'Cyber Security'
	];

	const skillsPool = [
		'Python', 'Java', 'JavaScript', 'React', 'Svelte', 'Testing', 'SQL',
		'HTML', 'CSS', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
		'Tailwind CSS', 'Git', 'GitHub', 'C++', 'C#', 'TypeScript', 'Angular',
		'Vue.js', 'Django', 'Flask', 'Spring Boot', 'AWS', 'Docker', 'Kubernetes',
		'Machine Learning', 'Deep Learning', 'Data Analysis', 'Tableau', 'PowerBI'
	];

	const companyNames = [
		'TCS', 'Infosys', 'Wipro', 'HCL', 'Zoho', 'Cognizant', 'Accenture', 'Capgemini',
		'Tech Mahindra', 'LTIMindtree', 'Google India', 'Microsoft India', 'Meta',
		'Amazon Development Center', 'Flipkart', 'Paytm', 'PhonePe', 'Razorpay', 'CRED',
		'Ola Cabs', 'Uber India', 'Zomato', 'Swiggy', 'Freshworks', 'InMobi', 'Mu Sigma',
		'Byjus', 'Unacademy', 'UpGrad', 'Tata Motors', 'Reliance Industries', 'L&T Technology Services',
		'Cognitive Solutions', 'CyberShield Labs', 'Vortex Systems', 'Alpha Analytics',
		'PixelCraft Studios', 'Apex Global', 'Zenith Tech', 'Innova Bio', 'BlueSky Renewables',
		'GreenPlast Solutions', 'QuantFinance Corp', 'Alpha Traders', 'WealthSecure Group',
		'Vanguard Marketing', 'BuzzWorks Digital', 'SwiftLogistics', 'Apex Builders', 'Matrix Designs',
		'MedTech Innovations', 'BioPharma Diagnostics', 'EduSpark Labs', 'LanguageLab', 'legalSphere',
		'AgriGrow Solutions', 'EcoTravels', 'StarHotels', 'Quantum Computing Labs', 'GovTech Solutions'
	];

	// Generate more random company names to reach 550+
	while (companyNames.length < 600) {
		const word1 = ['Alpha', 'Beta', 'Quantum', 'Vortex', 'Apex', 'Zenith', 'Innova', 'Matrix', 'Nexus', 'Tech', 'Cyber', 'Data', 'Web', 'Cloud', 'Logic', 'Prime', 'Global', 'Future', 'Nano', 'Mega', 'Hyper', 'Super', 'Ultra', 'Giga', 'Tera', 'Peta', 'Exa'];
		const word2 = ['Solutions', 'Systems', 'Labs', 'Analytics', 'Studios', 'Corp', 'Group', 'Networks', 'Tech', 'Software', 'Digital', 'Consulting', 'Hub', 'Space', 'Dynamics', 'Services', 'Ventures', 'Partners', 'Associates', 'Holdings'];
		const name = `${word1[Math.floor(Math.random() * word1.length)]} ${word2[Math.floor(Math.random() * word2.length)]}`;
		if (!companyNames.includes(name)) {
			companyNames.push(name);
		}
	}

	const passwordHash = hashPassword('company123');
	const studentPasswordHash = hashPassword('student123');

	// 1. Seed Companies
	if (db.companies.length < 500) {
		const existingCompanyEmails = new Set(db.companies.map(c => c.companyEmail));
		companyNames.forEach((name, i) => {
			const email = `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
			if (!existingCompanyEmails.has(email)) {
				db.companies.push({
					id: `comp_seed_${i + 1}`,
					companyName: name,
					companyEmail: email,
					companyContactNumber: `998877${String(i + 1000).substr(1)}`,
					website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
					companyAddress: `Tech Park Sector ${i % 10 + 1}, Chennai, India`,
					companyDescription: `Leading corporate provider of products and services in ${name}. Verified enterprise.`,
					industryType: i % 3 === 0 ? 'Software & IT' : i % 3 === 1 ? 'Engineering' : 'Business & Management',
					companyLogo: '',
					password: passwordHash,
					status: 'Approved',
					isSuspended: false,
					createdAt: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toISOString()
				});
			}
		});
	}

	// 2. Seed Students
	if (db.students.length < 2500) {
		const existingStudentEmails = new Set(db.students.map(s => s.email));
		for (let i = 0; i < 2600; i++) {
			const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
			const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
			const fullName = `${fn} ${ln}`;
			const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`;
			
			if (!existingStudentEmails.has(email)) {
				const studentSkills = [];
				const skillsCount = 3 + Math.floor(Math.random() * 4);
				while (studentSkills.length < skillsCount) {
					const skill = skillsPool[Math.floor(Math.random() * skillsPool.length)];
					if (!studentSkills.includes(skill)) {
						studentSkills.push(skill);
					}
				}

				db.students.push({
					id: `stud_seed_${i + 1}`,
					fullName,
					email,
					mobileNumber: `987654${String(i + 100000).substr(1)}`,
					password: studentPasswordHash,
					collegeName: colleges[Math.floor(Math.random() * colleges.length)],
					degreeCourse: degreeCourses[Math.floor(Math.random() * degreeCourses.length)],
					department: departments[Math.floor(Math.random() * departments.length)],
					yearOfStudy: String(1 + Math.floor(Math.random() * 4)),
					currentStatus: Math.random() > 0.15 ? 'Student' : 'Graduate',
					skills: studentSkills,
					address: `${i + 10} College Avenue, Landmark Road, City`,
					profilePhoto: '',
					resumePath: 'mock-resume.pdf',
					resumeStatus: 'Uploaded',
					applicationStatus: ['Applied', 'Shortlisted', 'Approved', 'Pending'][i % 4],
					isBlocked: false,
					bio: `Aspiring professional interested in building solutions and gaining corporate placement experience in ${studentSkills.slice(0, 2).join(' and ')}.`,
					createdAt: new Date(Date.now() - (2600 - i) * 24 * 60 * 60 * 1000).toISOString()
				});
			}
		}
	}

	// 3. Seed Internships
	if (db.internships.length < 5000) {
		const types = ['Free Internship', 'Paid Internship', 'Free + Stipend', 'Paid + Stipend'];
		const modes = ['Online', 'Offline', 'Hybrid'];
		const durations = ['1 Month', '2 Months', '3 Months', '6 Months'];

		let count = db.internships.length;
		DOMAINS.forEach((domainObj) => {
			for (let j = 0; j < 35; j++) {
				const randomComp = db.companies[Math.floor(Math.random() * db.companies.length)];
				const type = types[Math.floor(Math.random() * types.length)];
				const mode = modes[Math.floor(Math.random() * modes.length)];
				const duration = durations[Math.floor(Math.random() * durations.length)];

				const titleTemplates = [
					`${domainObj.name} Trainee`,
					`Junior ${domainObj.name} Associate`,
					`Graduate Intern - ${domainObj.name}`,
					`${domainObj.name} Specialist Intern`,
					`Lead Intern for ${domainObj.name}`,
					`${domainObj.name} System Assistant`
				];
				const title = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

				const fee = type.includes('Paid') ? (1000 + Math.floor(Math.random() * 5500)) : 0;
				const stipendAmount = type.includes('Stipend') ? (5000 + Math.floor(Math.random() * 15000)) : 0;

				const skillsCount = 2 + Math.floor(Math.random() * 3);
				const skillsRequired = [];
				if (domainObj.name.includes('Development') || domainObj.name.includes('Engineering') || domainObj.category === 'Software & IT') {
					skillsRequired.push('JavaScript', 'Python', 'React', 'SQL');
				} else {
					skillsRequired.push('Communication', 'Excel', 'Management', 'Research');
				}
				while (skillsRequired.length < skillsCount) {
					const skill = skillsPool[Math.floor(Math.random() * skillsPool.length)];
					if (!skillsRequired.includes(skill)) {
						skillsRequired.push(skill);
					}
				}

				db.internships.push({
					id: `intern_seed_${count + 1}`,
					companyId: randomComp.id,
					title,
					domain: domainObj.name,
					subCategory: `${domainObj.name} Sub-stream ${j + 1}`,
					skillsRequired,
					description: `Excellent opportunity to learn hands-on projects in the domain of ${domainObj.name}. Under expert supervision, you will design scalable features, conduct research, and interact with cross-functional corporate teams.`,
					learningOutcomes: `Develop deep practical skills in ${domainObj.name}, understand corporate development pipelines, and learn best practices in the sector.`,
					responsibilities: `Researching market trends, implementing tasks assigned by corporate lead, writing documentation, and presenting weekly summaries.`,
					eligibilityCriteria: `Open to current students or recent graduates in relevant streams with background knowledge in ${skillsRequired.slice(0, 2).join(', ')}.`,
					duration,
					startDate: '2026-08-01',
					lastDateToApply: '2026-07-25',
					mode,
					type,
					fee,
					stipendAmount,
					openings: 2 + Math.floor(Math.random() * 8),
					location: mode === 'Online' ? 'Remote' : 'Bangalore, India',
					certificateAvailable: Math.random() > 0.1 ? 'Yes' : 'No',
					jobOpportunity: Math.random() > 0.4 ? 'Yes' : 'No',
					status: 'Active',
					createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
				});
				count++;
			}
		});
	}

	saveDb(db);
	console.log(`Seeding complete. Current counts: Students: ${db.students.length}, Companies: ${db.companies.length}, Internships: ${db.internships.length}`);
}

// Database state tracker
let dbInstance = null;

// Firebase Background Sync Setup
function startFirebaseListener() {
	if (isFirebaseInitialized) return;
	isFirebaseInitialized = true;

	// Initial fetch to load remote data if it exists, otherwise push local
	get(dbRef).then((snapshot) => {
		if (snapshot.exists()) {
			console.log('Firebase: Downloaded database state from RTDB.');
			const remoteData = snapshot.val();
			dbInstance = remoteData;
			// Write safely without triggering loop
			const tempPath = `${DB_PATH}.tmp`;
			fs.writeFileSync(tempPath, JSON.stringify(dbInstance, null, 2), 'utf-8');
			fs.renameSync(tempPath, DB_PATH);
		} else {
			console.log('Firebase: Remote DB is empty. Uploading local seed state...');
			if (dbInstance) {
				set(dbRef, dbInstance).catch(e => console.error("Firebase push error:", e));
			}
		}
	}).catch(e => console.error("Firebase fetch error:", e));

	// Listen for remote updates
	onValue(dbRef, (snapshot) => {
		if (snapshot.exists()) {
			if (isFirebaseSyncing) return; // Prevent loop if WE just pushed
			const remoteData = snapshot.val();
			dbInstance = remoteData;
			// Update local file cache seamlessly
			try {
				const tempPath = `${DB_PATH}.tmp`;
				fs.writeFileSync(tempPath, JSON.stringify(dbInstance, null, 2), 'utf-8');
				fs.renameSync(tempPath, DB_PATH);
			} catch(e) { }
		}
	});
}

// Read Database
export function getDb() {
	if (dbInstance) {
		autoExpireInternships(dbInstance);
		return dbInstance;
	}

	try {
		if (fs.existsSync(DB_PATH)) {
			const data = fs.readFileSync(DB_PATH, 'utf-8');
			dbInstance = JSON.parse(data);
		} else {
			dbInstance = JSON.parse(JSON.stringify(DEFAULT_DB));
			// saveDb triggers firebase, but maybe not ready, just local write
			fs.writeFileSync(DB_PATH, JSON.stringify(dbInstance, null, 2), 'utf-8');
		}
	} catch (error) {
		console.error('Failed to read database.json, loading defaults:', error);
		dbInstance = JSON.parse(JSON.stringify(DEFAULT_DB));
	}

	// Initialize messages key if not present
	if (!dbInstance.messages) {
		dbInstance.messages = [];
	}

	autoExpireInternships(dbInstance);

	// Seeding triggers
	if (dbInstance.students.length < 2500 || dbInstance.companies.length < 100 || dbInstance.internships.length < 3000) {
		seedDatabase(dbInstance); // This uses saveDb which triggers Firebase
	}

	startFirebaseListener();

	return dbInstance;
}

// Write Database (Atomic helper + Firebase Push)
export function saveDb(data) {
	dbInstance = data;
	try {
		const tempPath = `${DB_PATH}.tmp`;
		fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
		fs.renameSync(tempPath, DB_PATH);
		
		// Push to Firebase Realtime Database
		isFirebaseSyncing = true;
		set(dbRef, data).then(() => {
			isFirebaseSyncing = false;
		}).catch(e => {
			isFirebaseSyncing = false;
			console.error('Failed to sync to Firebase:', e);
		});

		return true;
	} catch (error) {
		console.error('Failed to write database file:', error);
		return false;
	}
}

// Expired Internship Management: Auto close internships after deadline
function autoExpireInternships(db) {
	const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
	let changed = false;

	db.internships.forEach((internship) => {
		// If internship is Active but current date is past the apply deadline, close it
		if (internship.status === 'Active' && internship.lastDateToApply < today) {
			internship.status = 'Closed';
			changed = true;
			logAction('INTERNSHIP_AUTO_EXPIRE', `Internship ID ${internship.id} (${internship.title}) closed due to deadline ${internship.lastDateToApply} passing.`);
		}
	});

	if (changed) {
		saveDb(db);
	}
}

// Logging Utility
export function logAction(action, details) {
	const db = getDb();
	const newLog = {
		id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
		action,
		details,
		timestamp: new Date().toISOString()
	};
	db.systemLogs.unshift(newLog);
	// Limit logs to last 200
	if (db.systemLogs.length > 200) {
		db.systemLogs = db.systemLogs.slice(0, 200);
	}
	saveDb(db);
}

// Add Mock Resume File if not present, so download doesn't crash
export function ensureMockResumes() {
	try {
		const resume1 = path.join(RESUMES_DIR, 'mock-resume.pdf');
		const resume2 = path.join(RESUMES_DIR, 'mock-resume-2.pdf');
		if (!fs.existsSync(resume1)) {
			fs.writeFileSync(resume1, 'This is a mock PDF resume for John Doe. Skills: Full Stack, React, Node.js.', 'utf-8');
		}
		if (!fs.existsSync(resume2)) {
			fs.writeFileSync(resume2, 'This is a mock PDF resume for Jane Smith. Skills: Data Science, Python, SQL.', 'utf-8');
		}
	} catch (e) {
		console.error('Error writing mock resumes:', e);
	}
}

// Run initial resume check
ensureMockResumes();
