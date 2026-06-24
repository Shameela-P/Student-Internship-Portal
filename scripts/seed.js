import { overwriteEntireDatabase, DOMAINS, hashPassword } from '../src/lib/db.js';

// Dynamic Seeding Helper
function generateSeedData() {
	console.log('Seeding database with demo data...');

	const db = {
		students: [],
		companies: [],
		internships: [],
		applications: [],
		admins: [
			{
				id: 'admin_1',
				email: 'admin@nexora.com',
				fullName: 'Nexora Super Admin',
				password: hashPassword('admin123')
			}
		],
		notifications: [],
		emailTemplates: [],
		systemLogs: [
			{
				id: 'log_1',
				action: 'SYSTEM_STARTUP',
				details: 'Database seeded with domains, mock companies, and default students.',
				timestamp: new Date().toISOString()
			}
		],
		messages: []
	};

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

    // Default User
    db.students.push({
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
    });

	// 1. Seed Companies
	companyNames.forEach((name, i) => {
		const email = `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
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
	});

	// 2. Seed Students
	for (let i = 0; i < 2600; i++) {
		const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
		const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
		const fullName = `${fn} ${ln}`;
		const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`;
		
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

	// 3. Seed Internships
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

	console.log(`Seeding complete. Current counts: Students: ${db.students.length}, Companies: ${db.companies.length}, Internships: ${db.internships.length}`);
    return db;
}

async function runSeed() {
    console.log("Generating database payload...");
    const db = generateSeedData();
    
    console.log("Uploading to Firebase...");
    await overwriteEntireDatabase(db);

    console.log("Database seeded successfully!");
    process.exit(0);
}

runSeed();
