<script>
	import { page } from '$app/state';
	import logo from '$lib/assets/logo.svg';

	let { data, children } = $props();
	const student = $derived(data.student);
	const unread = $derived(data.unreadNotifications);
	const unreadMsgs = $derived(data.unreadMessages);

	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function getLinkClass(path) {
		const baseClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-200 cursor-pointer ";
		const activeClass = "bg-indigo-600 text-slate-900 dark:text-white shadow-lg shadow-indigo-500/15";
		const inactiveClass = "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white dark:bg-slate-900/50 dark:hover:text-slate-900 dark:text-white";
		
		if (page.url.pathname === path) {
			return baseClass + activeClass;
		}
		return baseClass + inactiveClass;
	}
</script>

<div class="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
	<!-- Sidebar (Desktop) -->
	<aside class="hidden md:flex flex-col w-64 border-r border-slate-200/20 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/40 backdrop-blur-lg fixed top-0 bottom-0 left-0 z-20">
		<!-- Brand Logo -->
		<div class="p-6 border-b border-slate-200/10 dark:border-slate-800/40 flex items-center gap-3">
			<img src={logo} alt="Nexora Logo" class="h-10 w-10 drop-shadow-md" />
			<span class="font-display font-extrabold text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 text-gradient">
				Nexora
			</span>
		</div>

		<!-- Nav Links -->
		<nav class="flex-grow p-4 space-y-1.5 mt-4 overflow-y-auto">
			<a href="/student" class={getLinkClass('/student')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
				Dashboard
			</a>
			<a href="/student/internships" class={getLinkClass('/student/internships')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><circle cx="12" cy="12" r="4"/></svg>
				Explore Internships
			</a>
			<a href="/student/companies" class={getLinkClass('/student/companies')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2Z"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2Z"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
				Explore Companies
			</a>
			<a href="/student/messages" class={getLinkClass('/student/messages')}>
				<div class="relative flex items-center gap-3 w-full">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
					<span>Chat Messages</span>
					{#if unreadMsgs > 0}
						<span class="absolute right-0 h-5 w-5 bg-blue-500 text-slate-900 dark:text-white rounded-full flex items-center justify-center text-[10px] font-bold">
							{unreadMsgs}
						</span>
					{/if}
				</div>
			</a>
			<a href="/student/notifications" class={getLinkClass('/student/notifications')}>
				<div class="relative flex items-center gap-3 w-full">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
					<span>Notifications</span>
					{#if unread > 0}
						<span class="absolute right-0 h-5 w-5 bg-rose-500 text-slate-900 dark:text-white rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse">
							{unread}
						</span>
					{/if}
				</div>
			</a>
			<a href="/student/profile" class={getLinkClass('/student/profile')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
				My Profile
			</a>
		</nav>

		<!-- Logged User Info bottom panel -->
		<div class="p-4 border-t border-slate-200/10 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-900/10">
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 rounded-full bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold font-display uppercase border border-indigo-500/10">
					{#if student.profilePhoto}
						<img src={student.profilePhoto} alt={student.fullName} class="h-10 w-10 rounded-full object-cover" />
					{:else}
						{student.fullName.charAt(0)}
					{/if}
				</div>
				<div class="flex-grow min-w-0">
					<h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{student.fullName}</h4>
					<span class="text-xs text-slate-500 truncate block">Student</span>
				</div>
			</div>
			<a
				href="/logout"
				class="mt-4 flex items-center justify-center gap-2 py-2 w-full rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition duration-150 cursor-pointer"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
				Sign Out
			</a>
		</div>
	</aside>

	<!-- Mobile Header Navbar -->
	<header class="md:hidden w-full flex items-center justify-between py-4 px-6 border-b border-slate-200/10 dark:border-slate-800/40 bg-white/40 dark:bg-slate-950/40 backdrop-blur-lg sticky top-0 z-30">
		<div class="flex items-center gap-3">
			<img src={logo} alt="Nexora Logo" class="h-8 w-8 drop-shadow-sm" />
			<span class="font-display font-extrabold text-lg dark:text-white">Nexora</span>
		</div>
		<div class="flex items-center gap-3">
			<!-- Notification quick badge -->
			<a href="/student/notifications" class="relative p-2 text-slate-600 dark:text-slate-400">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
				{#if unread > 0}
					<span class="absolute top-1 right-1 h-2.5 w-2.5 bg-rose-500 rounded-full animate-pulse"></span>
				{/if}
			</a>
			<!-- Mobile Hamburger Button -->
			<button onclick={toggleMobileMenu} class="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/10 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer">
				{#if mobileMenuOpen}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
				{/if}
			</button>
		</div>
	</header>

	<!-- Mobile Menu Drawer -->
	{#if mobileMenuOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="md:hidden fixed inset-x-0 top-[69px] bottom-0 bg-slate-950/30 backdrop-blur-md z-40" onclick={toggleMobileMenu}>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200/10 p-4 space-y-2 flex flex-col justify-between" onclick={(e) => e.stopPropagation()}>
				<nav class="space-y-1">
					<a href="/student" class={getLinkClass('/student')} onclick={toggleMobileMenu}>Dashboard</a>
					<a href="/student/internships" class={getLinkClass('/student/internships')} onclick={toggleMobileMenu}>Explore Internships</a>
					<a href="/student/companies" class={getLinkClass('/student/companies')} onclick={toggleMobileMenu}>Explore Companies</a>
					<a href="/student/messages" class={getLinkClass('/student/messages')} onclick={toggleMobileMenu}>Chat Messages</a>
					<a href="/student/notifications" class={getLinkClass('/student/notifications')} onclick={toggleMobileMenu}>Notifications</a>
					<a href="/student/profile" class={getLinkClass('/student/profile')} onclick={toggleMobileMenu}>My Profile</a>
				</nav>
				<div class="border-t border-slate-200/10 pt-4">
					<a href="/logout" class="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition duration-150">Sign Out</a>
				</div>
			</div>
		</div>
	{/if}

	<!-- Right Side Scrollable Page Content Container -->
	<div class="flex-grow md:ml-64 p-6 md:p-10 min-h-screen relative flex flex-col">
		<div class="max-w-6xl w-full mx-auto flex-grow flex flex-col">
			{@render children()}
		</div>
	</div>
</div>
