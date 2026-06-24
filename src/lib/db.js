import { getDatabase, ref, get, child, update, set, remove } from "firebase/database";
import { app } from "./firebase.js";
import crypto from 'crypto';

const database = getDatabase(app);
const dbRef = ref(database, '/');

// Hashing helper
export function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.scryptSync(password, salt, 64).toString('hex');
	return `${salt}:${hash}`;
}

// 150+ Domains data
export const DOMAINS = [
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

	{ id: 101, name: 'Teaching Assistant', category: 'Education & Research' },
	{ id: 102, name: 'Educational Technology', category: 'Education & Research' },
	{ id: 103, name: 'Academic Research', category: 'Education & Research' },
	{ id: 104, name: 'Curriculum Development', category: 'Education & Research' },
	{ id: 105, name: 'E-Learning Development', category: 'Education & Research' },

	{ id: 106, name: 'Tamil Literature', category: 'Arts, Literature & Languages' },
	{ id: 107, name: 'English Literature', category: 'Arts, Literature & Languages' },
	{ id: 108, name: 'Hindi Literature', category: 'Arts, Literature & Languages' },
	{ id: 109, name: 'Linguistics', category: 'Arts, Literature & Languages' },
	{ id: 110, name: 'Translation Services', category: 'Arts, Literature & Languages' },
	{ id: 111, name: 'Creative Writing', category: 'Arts, Literature & Languages' },

	{ id: 112, name: 'History', category: 'Social Sciences' },
	{ id: 113, name: 'Geography', category: 'Social Sciences' },
	{ id: 114, name: 'Political Science', category: 'Social Sciences' },
	{ id: 115, name: 'Sociology', category: 'Social Sciences' },
	{ id: 116, name: 'Psychology', category: 'Social Sciences' },
	{ id: 117, name: 'Anthropology', category: 'Social Sciences' },
	{ id: 118, name: 'Economics', category: 'Social Sciences' },

	{ id: 119, name: 'Legal Research', category: 'Law & Governance' },
	{ id: 120, name: 'Corporate Law', category: 'Law & Governance' },
	{ id: 121, name: 'Intellectual Property Rights', category: 'Law & Governance' },
	{ id: 122, name: 'Compliance Management', category: 'Law & Governance' },
	{ id: 123, name: 'Public Administration', category: 'Law & Governance' },

	{ id: 124, name: 'Agriculture', category: 'Agriculture & Environment' },
	{ id: 125, name: 'Agribusiness', category: 'Agriculture & Environment' },
	{ id: 126, name: 'Horticulture', category: 'Agriculture & Environment' },
	{ id: 127, name: 'Environmental Science', category: 'Agriculture & Environment' },
	{ id: 128, name: 'Sustainability Studies', category: 'Agriculture & Environment' },
	{ id: 129, name: 'Forestry', category: 'Agriculture & Environment' },
	{ id: 130, name: 'Wildlife Conservation', category: 'Agriculture & Environment' },

	{ id: 131, name: 'Hotel Management', category: 'Hospitality & Tourism' },
	{ id: 132, name: 'Tourism Management', category: 'Hospitality & Tourism' },
	{ id: 133, name: 'Travel Operations', category: 'Hospitality & Tourism' },
	{ id: 134, name: 'Event Management', category: 'Hospitality & Tourism' },
	{ id: 135, name: 'Culinary Arts', category: 'Hospitality & Tourism' },

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

	{ id: 146, name: 'E-Governance', category: 'Government & Public Services' },
	{ id: 147, name: 'Rural Development', category: 'Government & Public Services' },
	{ id: 148, name: 'Urban Planning', category: 'Government & Public Services' },
	{ id: 149, name: 'Public Policy', category: 'Government & Public Services' },
	{ id: 150, name: 'Social Work', category: 'Government & Public Services' }
];

// Firebase Async Utilities

/**
 * Gets an entire collection (array of items)
 * Stored as an array in Firebase, but might be fetched as an object with numeric keys.
 * We normalize it back to an array.
 */
export async function getCollection(collectionName) {
	const snapshot = await get(child(dbRef, collectionName));
	if (!snapshot.exists()) return [];
	const data = snapshot.val();
	
	// Normalize to array (Firebase might return an object or array)
	if (Array.isArray(data)) {
		return data.filter(item => item !== null);
	} else if (typeof data === 'object') {
		return Object.values(data).filter(item => item !== null);
	}
	return [];
}

/**
 * Fetch a specific item from a collection by its array index OR by its unique 'id' property.
 * Since previously it was just arrays stored in Firebase, we should fetch the collection and find it,
 * unless we migrate the DB to use ID as the key. For now, fetching collection and finding is safer 
 * to preserve array indices, or we can use Firebase queries.
 * Since we want targeted loading, we can try to fetch the collection.
 * Wait, to avoid downloading 5MB, we SHOULD use an index, but Firebase stores them as an array.
 * We'll use a local helper to find it. If we need to scale later, we can restructure Firebase.
 */
export async function getDocument(collectionName, id) {
	const collection = await getCollection(collectionName);
	return collection.find(item => item && item.id === id) || null;
}

/**
 * Add a new item to an array collection.
 */
export async function addDocument(collectionName, data) {
	const collection = await getCollection(collectionName);
	collection.push(data);
	await set(child(dbRef, collectionName), collection);
}

/**
 * Update an existing item in a collection.
 */
export async function updateDocument(collectionName, id, updates) {
	const collection = await getCollection(collectionName);
	const index = collection.findIndex(item => item && item.id === id);
	if (index !== -1) {
		collection[index] = { ...collection[index], ...updates };
		// Partial update using index
		await set(child(dbRef, `${collectionName}/${index}`), collection[index]);
	}
}

/**
 * Delete an item from a collection
 */
export async function deleteDocument(collectionName, id) {
	const collection = await getCollection(collectionName);
	const index = collection.findIndex(item => item && item.id === id);
	if (index !== -1) {
		await remove(child(dbRef, `${collectionName}/${index}`));
	}
}

/**
 * Update multiple collections at once (used by refactored routes)
 */
export async function updateEntireDatabase(data) {
	await update(dbRef, data);
}

/**
 * For the seed script. Overwrites everything.
 */
export async function overwriteEntireDatabase(data) {
	await set(dbRef, data);
}

/**
 * Unified Logger
 */
export async function logAction(action, details) {
	const newLog = {
		id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
		action,
		details,
		timestamp: new Date().toISOString()
	};
	
	const logs = await getCollection('systemLogs');
	logs.unshift(newLog);
	if (logs.length > 200) {
		logs.length = 200; // truncate
	}
	await set(child(dbRef, 'systemLogs'), logs);
}

// Ensure Mock resumes exist on disk locally for tests/downloads (Vercel won't persist this, but needed for dev)
import fs from 'fs';
import path from 'path';
export function ensureMockResumes() {
	try {
        const isServerless = !!(process.env.VERCEL || process.env.AWS_REGION || process.env.AWS_EXECUTION_ENV);
        const RESUMES_DIR = isServerless ? '/tmp/resumes' : path.resolve('uploads/resumes');
        if (!fs.existsSync(RESUMES_DIR)) {
            fs.mkdirSync(RESUMES_DIR, { recursive: true });
        }
		const resume1 = path.join(RESUMES_DIR, 'mock-resume.pdf');
		const resume2 = path.join(RESUMES_DIR, 'mock-resume-2.pdf');
		if (!fs.existsSync(resume1)) {
			fs.writeFileSync(resume1, 'This is a mock PDF resume for John Doe.', 'utf-8');
		}
		if (!fs.existsSync(resume2)) {
			fs.writeFileSync(resume2, 'This is a mock PDF resume for Jane Smith.', 'utf-8');
		}
	} catch (e) {
		console.error('Error writing mock resumes:', e);
	}
}
ensureMockResumes();
