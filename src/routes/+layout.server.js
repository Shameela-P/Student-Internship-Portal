import { getSessionUser } from '$lib/auth';

export function load({ cookies }) {
	const user = getSessionUser(cookies);
	return {
		user
	};
}
