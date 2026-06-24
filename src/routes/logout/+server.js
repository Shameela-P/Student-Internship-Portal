import { redirect } from '@sveltejs/kit';
import { logAction } from '$lib/db';
import { verifyToken } from '$lib/auth';

function handleLogout(cookies) {
	const sessionToken = cookies.get('nexora_session');
	let userInfo = 'User';

	if (sessionToken) {
		const decoded = verifyToken(sessionToken);
		if (decoded) {
			userInfo = `${decoded.role.charAt(0).toUpperCase() + decoded.role.slice(1)} ${decoded.name || decoded.email}`;
		}
	}

	cookies.delete('nexora_session', { path: '/' });
	cookies.delete('nexora_refresh', { path: '/' });
	logAction('LOGOUT', `${userInfo} logged out of session.`);
	throw redirect(303, '/');
}

export function GET({ cookies }) {
	return handleLogout(cookies);
}

export function POST({ cookies }) {
	return handleLogout(cookies);
}
