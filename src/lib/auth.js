import crypto from 'crypto';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const SECRET_KEY = env.JWT_SECRET || 'nexora_super_secret_key_2026_safe';
const REFRESH_SECRET = env.JWT_REFRESH_SECRET || 'nx_refresh_token_very_secure_99';

// Hash verification
export function verifyPassword(password, stored) {
	try {
		if (!stored || !stored.includes(':')) return false;
		const [salt, hash] = stored.split(':');
		const verify = crypto.scryptSync(password, salt, 64).toString('hex');
		return hash === verify;
	} catch (e) {
		console.error('Password verification failed:', e);
		return false;
	}
}

// Custom Hashing (Exposed for new registrations)
export function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = crypto.scryptSync(password, salt, 64).toString('hex');
	return `${salt}:${hash}`;
}

// Token creation (Custom signed token similar to JWT)
export function createToken(payload) {
	const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
	const body = Buffer.from(JSON.stringify({
		...payload,
		exp: Date.now() + 1000 * 60 * 60 * 24 // 24 Hours validity
	})).toString('base64url');

	const signature = crypto
		.createHmac('sha256', SECRET_KEY)
		.update(`${header}.${body}`)
		.digest('base64url');

	return `${header}.${body}.${signature}`;
}

// Token creation (Refresh Token)
export function createRefreshToken(payload) {
	const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
	const body = Buffer.from(JSON.stringify({
		...payload,
		exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 Days validity
	})).toString('base64url');

	const signature = crypto
		.createHmac('sha256', REFRESH_SECRET)
		.update(`${header}.${body}`)
		.digest('base64url');

	return `${header}.${body}.${signature}`;
}

// Token verification (can verify both access and refresh tokens)
export function verifyToken(token, isRefresh = false) {
	if (!token) return null;
	const parts = token.split('.');
	if (parts.length !== 3) return null;

	const [header, body, signature] = parts;
	const expectedSignature = crypto
		.createHmac('sha256', isRefresh ? REFRESH_SECRET : SECRET_KEY)
		.update(`${header}.${body}`)
		.digest('base64url');

	if (signature !== expectedSignature) return null;

	try {
		const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
		if (payload.exp < Date.now()) {
			return null; // Expired
		}
		return payload;
	} catch (e) {
		return null;
	}
}

// Authenticate session from request cookies
export function getSessionUser(cookies) {
	const sessionCookie = cookies.get('nexora_session');
	let user = verifyToken(sessionCookie);
	
	if (!user) {
		// Attempt refresh
		const refreshCookie = cookies.get('nexora_refresh');
		const refreshUser = verifyToken(refreshCookie, true);
		if (refreshUser) {
			user = { id: refreshUser.id, email: refreshUser.email, name: refreshUser.name, role: refreshUser.role };
			const newToken = createToken(user);
			cookies.set('nexora_session', newToken, {
				path: '/',
				httpOnly: true,
				secure: env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24
			});
		}
	}
	return user;
}

// SvelteKit Route guard helper
export function requireRole(cookies, allowedRoles) {
	const user = getSessionUser(cookies);
	if (!user) {
		throw redirect(303, '/login');
	}
	if (!allowedRoles.includes(user.role)) {
		// Redirect to respective dashboard if they try to cross-access
		throw redirect(303, `/${user.role}`);
	}
	return user;
}
