<script>
	import { enhance } from '$app/forms';
	import { auth, googleProvider } from '$lib/firebase';
	import { signInWithPopup } from 'firebase/auth';

	let { form } = $props();

	// Reactive state for selected role
	let activeRole = $state('student'); // 'student' | 'company' | 'admin'
	let loading = $state(false);
	
	let googleRole = $state('student');
	let googleLoading = $state(false);
	let googleError = $state('');

	function setRole(role) {
		activeRole = role;
	}

	async function handleGoogleSignIn() {
		googleLoading = true;
		googleError = '';
		try {
			const result = await signInWithPopup(auth, googleProvider);
			const user = result.user;

			// Send user data to our backend endpoint
			const response = await fetch('/login/google', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: user.email,
					name: user.displayName,
					photoURL: user.photoURL,
					role: googleRole
				})
			});

			const data = await response.json();
			if (data.success) {
				window.location.href = data.redirect;
			} else {
				googleError = data.error || 'Failed to sign in with Google.';
			}
		} catch (error) {
			console.error("Google Auth Error", error);
			googleError = "Google authentication was cancelled or failed.";
		} finally {
			googleLoading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center p-6 relative">
	<!-- Ambient Background Glows -->
	<div class="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none"></div>
	<div class="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>

	<!-- Card Container -->
	<div class="w-full max-w-lg rounded-3xl glass p-8 md:p-10 shadow-2xl relative border border-slate-200/20 dark:border-slate-800/40">
		
		<!-- Back to home -->
		<a href="/" class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 mb-8 transition cursor-pointer">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
			Back to home
		</a>

		<div class="text-center mb-8">
			<h1 class="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
				Welcome Back
			</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
				Sign in to access your Nexora dashboard.
			</p>
		</div>

		<!-- Role Selection Tabs -->
		<div class="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/60 rounded-2xl mb-8 border border-slate-200/5 dark:border-slate-800/40">
			<button
				type="button"
				onclick={() => setRole('student')}
				class="py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer {activeRole === 'student' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}"
			>
				Student
			</button>
			<button
				type="button"
				onclick={() => setRole('company')}
				class="py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer {activeRole === 'company' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}"
			>
				Company
			</button>
			<button
				type="button"
				onclick={() => setRole('admin')}
				class="py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer {activeRole === 'admin' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}"
			>
				Admin
			</button>
		</div>

		<!-- Error Feedback -->
		{#if form?.error || googleError}
			<div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
				{form?.error || googleError}
			</div>
		{/if}

		<!-- Login Form -->
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return ({ update }) => {
					loading = false;
					update();
				};
			}}
			class="space-y-5"
		>
			<!-- Hidden field for active role -->
			<input type="hidden" name="role" value={activeRole} />

			<div>
				<label for="email" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
					{#if activeRole === 'company'}
						Company Email Address
					{:else}
						Email Address
					{/if}
				</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					placeholder="name@example.com"
					class="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
				/>
			</div>

			<div>
				<div class="flex items-center justify-between mb-2">
					<label for="password" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
						Password
					</label>
				</div>
				<input
					type="password"
					id="password"
					name="password"
					required
					placeholder="••••••••"
					class="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none transition text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
				/>
			</div>

			<button
				type="submit"
				disabled={loading}
				class="w-full py-3.5 rounded-xl font-bold text-slate-900 dark:text-white bg-[#cc2233] hover:bg-[#b01e2c] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
			>
				{#if loading}
					<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
					Signing In...
				{:else}
					Sign In
				{/if}
			</button>

			<div class="relative flex items-center py-2">
				<div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
				<span class="flex-shrink-0 mx-4 text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500">or</span>
				<div class="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
			</div>

			<div>
				<label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
					ROLE (ONLY FOR FIRST-TIME GOOGLE SIGN-UP)
				</label>
				<select bind:value={googleRole} class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none transition text-sm text-slate-900 dark:text-white cursor-pointer">
					<option value="student">Student / Intern</option>
					<option value="company">Company / Employer</option>
				</select>
			</div>

			<button
				type="button"
				onclick={handleGoogleSignIn}
				disabled={googleLoading}
				class="w-full py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50"
			>
				{#if googleLoading}
					<span class="h-4 w-4 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin"></span>
					Connecting...
				{:else}
					<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
						<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
						<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
						<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
					</svg>
					Continue with Google
				{/if}
			</button>
		</form>

		<!-- Bottom Sign Up -->
		{#if activeRole !== 'admin'}
			<div class="mt-8 pt-6 border-t border-slate-200/10 dark:border-slate-800/40 text-center text-sm">
				<span class="text-slate-500">New to Nexora?</span>
				<a href="/register?role={activeRole}" class="font-bold text-indigo-500 dark:text-indigo-400 hover:underline ml-1">
					Create an Account
				</a>
			</div>
		{/if}
	</div>
</div>
