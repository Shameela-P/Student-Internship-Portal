import { json } from '@sveltejs/kit';
import { verifyToken, createToken } from '$lib/auth';
import { dev } from '$app/environment';

export async function POST({ cookies }) {
	const refreshToken = cookies.get('nexora_refresh');

	if (!refreshToken) {
		return json({ success: false, error: 'No refresh token available' }, { status: 401 });
	}

	const payload = verifyToken(refreshToken, true); // true = isRefresh

	if (!payload) {
		cookies.delete('nexora_session', { path: '/' });
		cookies.delete('nexora_refresh', { path: '/' });
		return json({ success: false, error: 'Invalid or expired refresh token' }, { status: 401 });
	}

	// Generate new access token
	const newPayload = { id: payload.id, email: payload.email, name: payload.name, role: payload.role };
	const newToken = createToken(newPayload);

	cookies.set('nexora_session', newToken, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 // 1 day
	});

	return json({ success: true, message: 'Session refreshed successfully' });
}
