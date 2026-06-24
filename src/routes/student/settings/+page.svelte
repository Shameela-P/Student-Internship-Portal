<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const student = $derived(data.student);
	const settings = $derived(data.settings);

	let passwordLoading = $state(false);
	let prefLoading = $state(false);

	let feedbackMsg = $state('');
	let feedbackError = $state('');

	$effect(() => {
		if (form) {
			if (form.success) {
				feedbackMsg = form.message || 'Updated successfully!';
				feedbackError = '';
				const timer = setTimeout(() => feedbackMsg = '', 4000);
				return () => clearTimeout(timer);
			} else {
				feedbackError = form.error || 'Operation failed';
				feedbackMsg = '';
			}
		}
	});

	// Client-side theme control helper
	let darkTheme = $state(true);

	onMount(() => {
		darkTheme = document.documentElement.classList.contains('dark');
	});

	import { onMount } from 'svelte';
	function toggleTheme() {
		darkTheme = !darkTheme;
		if (darkTheme) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	const activeSessions = [
		{ device: 'Windows 11 PC • Edge Browser', location: 'Chennai, India', status: 'Active Now', date: 'Current Session' },
		{ device: 'iPhone 15 Pro • Safari', location: 'Bangalore, India', status: 'Authorized', date: '2 days ago' }
	];
</script>

<div class="mb-8">
	<h1 class="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
		Account Settings
	</h1>
	<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
		Configure security credentials, notification rules, privacy controls, and active sessions.
	</p>
</div>

<!-- Feedback Alerts -->
{#if feedbackMsg}
	<div class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
		{feedbackMsg}
	</div>
{/if}
{#if feedbackError}
	<div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs font-semibold flex items-center gap-2">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
		{feedbackError}
	</div>
{/if}

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
	
	<!-- Left Side Settings Categories -->
	<div class="space-y-6">
		<!-- Theme Toggle Box -->
		<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[140px]">
			<div>
				<h3 class="font-display font-bold text-base text-slate-900 dark:text-white">Visual Interface</h3>
				<p class="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-normal">Toggle background rendering styles for dark or light environments.</p>
			</div>
			
			<button
				onclick={toggleTheme}
				class="mt-4 w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-200 transition cursor-pointer flex items-center justify-center gap-2"
			>
				{#if darkTheme}
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
					Switch to Light Mode
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
					Switch to Dark Mode
				{/if}
			</button>
		</div>

		<!-- Sessions List -->
		<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
			<h3 class="font-display font-bold text-base text-slate-900 dark:text-white mb-3">Authorized Sessions</h3>
			<p class="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-normal">Devices currently authorized to access your placement records.</p>
			
			<div class="space-y-4">
				{#each activeSessions as session}
					<div class="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/50 bg-slate-950/20 text-xs">
						<div class="flex items-center justify-between">
							<strong class="text-slate-350 text-[11px] font-bold block">{session.device}</strong>
							<span class="px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">{session.status}</span>
						</div>
						<div class="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-semibold">
							<span>{session.location}</span>
							<span>{session.date}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Right Side Forms -->
	<div class="lg:col-span-2 space-y-8">
		<!-- Privacy and Rules Form -->
		<div class="p-8 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
			<h3 class="font-display font-bold text-lg text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
				Preferences & Privacy Rules
			</h3>

			<form
				action="?/updatePreferences"
				method="POST"
				use:enhance={() => {
					prefLoading = true;
					return ({ update }) => {
						prefLoading = false;
						update();
					};
				}}
				class="space-y-6 text-xs text-slate-300"
			>
				<!-- Notification checkboxes -->
				<div>
					<h4 class="font-bold text-slate-450 uppercase tracking-widest text-[9px] mb-3">Notification Settings</h4>
					<div class="space-y-3">
						<label class="flex items-center gap-3 cursor-pointer">
							<input type="checkbox" name="emailNotifications" value="true" checked={settings.emailNotifications} class="accent-blue-500 h-4 w-4 shrink-0 rounded border-slate-200 dark:border-slate-800/50 bg-slate-950" />
							<div>
								<span class="font-bold text-slate-900 dark:text-white block">Email Placements Alerts</span>
								<span class="text-[10px] text-slate-500 mt-0.5 block leading-normal">Send automated messages when companies update applications or generate certificates.</span>
							</div>
						</label>
						
						<label class="flex items-center gap-3 cursor-pointer">
							<input type="checkbox" name="smsNotifications" value="true" checked={settings.smsNotifications} class="accent-blue-500 h-4 w-4 shrink-0 rounded border-slate-200 dark:border-slate-800/50 bg-slate-950" />
							<div>
								<span class="font-bold text-slate-900 dark:text-white block">SMS Notification Integrations</span>
								<span class="text-[10px] text-slate-500 mt-0.5 block leading-normal">Send quick mobile warnings regarding fraud alerts or scheduling changes.</span>
							</div>
						</label>

						<label class="flex items-center gap-3 cursor-pointer">
							<input type="checkbox" name="chatReceipts" value="true" checked={settings.chatReceipts} class="accent-blue-500 h-4 w-4 shrink-0 rounded border-slate-200 dark:border-slate-800/50 bg-slate-950" />
							<div>
								<span class="font-bold text-slate-900 dark:text-white block">Read Receipts for Chat Messages</span>
								<span class="text-[10px] text-slate-500 mt-0.5 block leading-normal">Allow recruiters to see when you have viewed their chat updates.</span>
							</div>
						</label>
					</div>
				</div>

				<!-- Privacy Dropdown -->
				<div class="pt-4 border-t border-slate-200 dark:border-slate-800/50">
					<h4 class="font-bold text-slate-450 uppercase tracking-widest text-[9px] mb-3">Profile Discovery Controls</h4>
					<label for="profileVisibility" class="block text-slate-600 dark:text-slate-400 mb-2 font-semibold">Corporate Visibility Status</label>
					<select id="profileVisibility" name="profileVisibility" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-955 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
						<option value="public" selected={settings.profileVisibility === 'public'}>Public (Allow all verified companies to find my details)</option>
						<option value="applied_only" selected={settings.profileVisibility === 'applied_only'}>Only Companies I Applied To (Restrict general searches)</option>
						<option value="private" selected={settings.profileVisibility === 'private'}>Private (Hide my profile from all search registries)</option>
					</select>
				</div>

				<!-- MFA Toggle -->
				<div class="pt-4 border-t border-slate-200 dark:border-slate-800/50">
					<h4 class="font-bold text-slate-450 uppercase tracking-widest text-[9px] mb-3">Account Security</h4>
					<label class="flex items-center gap-3 cursor-pointer">
						<input type="checkbox" name="twoFactorAuth" value="true" checked={settings.twoFactorAuth} class="accent-blue-500 h-4 w-4 shrink-0 rounded border-slate-200 dark:border-slate-800/50 bg-slate-950" />
						<div>
							<span class="font-bold text-slate-900 dark:text-white block">Two-Factor Authentication (2FA)</span>
							<span class="text-[10px] text-slate-500 mt-0.5 block leading-normal">Request verification codes when executing logins on unrecognized devices.</span>
						</div>
					</label>
				</div>

				<button
					type="submit"
					disabled={prefLoading}
					class="w-full py-3.5 rounded-xl font-bold text-slate-900 dark:text-white bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
				>
					{#if prefLoading}
						<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						Saving Settings...
					{:else}
						Save Preferences
					{/if}
				</button>
			</form>
		</div>

		<!-- Change Password Form -->
		<div class="p-8 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
			<h3 class="font-display font-bold text-lg text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
				Update Password Credentials
			</h3>

			<form
				action="?/changePassword"
				method="POST"
				use:enhance={() => {
					passwordLoading = true;
					return ({ update }) => {
						passwordLoading = false;
						update();
					};
				}}
				class="space-y-5"
			>
				<div>
					<label for="currentPassword" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Current Password</label>
					<input type="password" id="currentPassword" name="currentPassword" required class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="newPassword" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">New Password</label>
						<input type="password" id="newPassword" name="newPassword" required class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div>
						<label for="confirmPassword" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Confirm New Password</label>
						<input type="password" id="confirmPassword" name="confirmPassword" required class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-955 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>
				</div>

				<button
					type="submit"
					disabled={passwordLoading}
					class="w-full py-3.5 rounded-xl font-bold text-slate-900 dark:text-white bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
				>
					{#if passwordLoading}
						<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						Updating Password...
					{:else}
						Update Security Password
					{/if}
				</button>
			</form>
		</div>
	</div>
</div>
