import { fail, redirect } from '@sveltejs/kit';
import { logAction, getCollection } from '$lib/db';
import { verifyPassword, createToken, createRefreshToken, verifyToken } from '$lib/auth';
import { dev } from '$app/environment';

export async function load({ cookies }) {
	// If already logged in, redirect them away from login page to dashboard
	const sessionCookie = cookies.get('nexora_session');
	if (sessionCookie) {
		const session = verifyToken(sessionCookie);
		if (session) {
			throw redirect(303, `/${session.role}`);
		}
	}
	return {};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString().trim();
		const password = formData.get('password')?.toString();
		const role = formData.get('role')?.toString(); // 'student' | 'company' | 'admin'

		if (!email || !password || !role) {
			return fail(400, { success: false, error: 'All fields are required' });
		}

		const db = {
		students: await getCollection('students'),
		companies: await getCollection('companies'),
		admins: await getCollection('admins')
	};

		const setAuthCookies = (payload) => {
			const token = createToken(payload);
			const refresh = createRefreshToken(payload);
			
			const cookieOpts = {
				path: '/',
				httpOnly: true,
				secure: !dev,
				sameSite: 'lax' // lax for standard SvelteKit dev compatibility, strict in prod
			};

			cookies.set('nexora_session', token, { ...cookieOpts, maxAge: 60 * 60 * 24 }); // 1 day
			cookies.set('nexora_refresh', refresh, { ...cookieOpts, maxAge: 60 * 60 * 24 * 7 }); // 7 days
		};

		if (role === 'student') {
			const student = db.students.find(s => s.email.toLowerCase() === email.toLowerCase());
			if (!student) return fail(400, { success: false, error: 'Invalid email or password' });
			if (student.isBlocked) return fail(403, { success: false, error: 'Your student account has been blocked by administrators' });
			if (!verifyPassword(password, student.password)) return fail(400, { success: false, error: 'Invalid email or password' });

			setAuthCookies({ id: student.id, email: student.email, name: student.fullName, role: 'student' });
			logAction('STUDENT_LOGIN', `Student ${student.fullName} (${student.email}) logged in successfully.`);
			throw redirect(303, '/student');
		} 
		else if (role === 'company') {
			const company = db.companies.find(c => c.companyEmail.toLowerCase() === email.toLowerCase());
			if (!company) return fail(400, { success: false, error: 'Invalid email or password' });
			if (company.isSuspended) return fail(403, { success: false, error: 'Your company profile has been suspended due to fraudulent flag warnings' });
			if (!verifyPassword(password, company.password)) return fail(400, { success: false, error: 'Invalid email or password' });

			setAuthCookies({ id: company.id, email: company.companyEmail, name: company.companyName, role: 'company' });
			logAction('COMPANY_LOGIN', `Company ${company.companyName} logged in.`);
			throw redirect(303, '/company');
		} 
		else if (role === 'admin') {
			const admin = db.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
			if (!admin) return fail(400, { success: false, error: 'Invalid credentials' });
			if (!verifyPassword(password, admin.password)) return fail(400, { success: false, error: 'Invalid credentials' });

			setAuthCookies({ id: admin.id, email: admin.email, name: admin.fullName, role: 'admin' });
			logAction('ADMIN_LOGIN', 'Super administrator logged in.');
			throw redirect(303, '/admin');
		}

		return fail(400, { success: false, error: 'Invalid role selection' });
	}
};
