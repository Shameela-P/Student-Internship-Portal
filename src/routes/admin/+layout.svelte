<script>
	import { page } from '$app/state';
	import logo from '$lib/assets/logo.svg';

	let { data, children } = $props();
	const admin = $derived(data.admin);
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
		<div class="p-6 border-b border-slate-200/10 dark:border-slate-800/40 flex items-center gap-3">
			<img src={logo} alt="Nexora Logo" class="h-10 w-10 drop-shadow-md" />
			<span class="font-display font-extrabold text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 text-gradient">
				Nexora
			</span>
		</div>

		<nav class="flex-grow p-4 space-y-1.5 mt-4 overflow-y-auto">
			<a href="/admin" class={getLinkClass('/admin')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
				Overview
			</a>
			<a href="/admin/companies" class={getLinkClass('/admin/companies')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
				Companies Board
			</a>
			<a href="/admin/students" class={getLinkClass('/admin/students')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
				Students Board
			</a>
			<a href="/admin/messages" class={getLinkClass('/admin/messages')}>
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
			<a href="/admin/email-templates" class={getLinkClass('/admin/email-templates')}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"/><path d="M2 9.5 12 14l10-4.5"/></svg>
				Mail Templates
			</a>
		</nav>

		<!-- Bottom User Block -->
		<div class="p-4 border-t border-slate-200/10 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-900/10">
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 rounded-full bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold uppercase border border-indigo-500/10">
					A
				</div>
				<div class="flex-grow min-w-0">
					<h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{admin.fullName}</h4>
					<span class="text-xs text-slate-500 truncate block">Administrator</span>
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
		<button onclick={toggleMobileMenu} class="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/10 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer">
			{#if mobileMenuOpen}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
			{/if}
		</button>
	</header>

	<!-- Mobile Drawer -->
	{#if mobileMenuOpen}
		<div class="md:hidden fixed inset-x-0 top-[69px] bottom-0 bg-slate-950/30 backdrop-blur-md z-40" onclick={toggleMobileMenu}>
			<div class="w-64 h-full bg-white dark:bg-slate-900 border-r border-slate-200/10 p-4 space-y-2 flex flex-col justify-between" onclick={(e) => e.stopPropagation()}>
				<nav class="space-y-1">
					<a href="/admin" class={getLinkClass('/admin')} onclick={toggleMobileMenu}>Overview</a>
					<a href="/admin/companies" class={getLinkClass('/admin/companies')} onclick={toggleMobileMenu}>Companies Board</a>
					<a href="/admin/students" class={getLinkClass('/admin/students')} onclick={toggleMobileMenu}>Students Board</a>
					<a href="/admin/messages" class={getLinkClass('/admin/messages')} onclick={toggleMobileMenu}>Chat Messages</a>
					<a href="/admin/email-templates" class={getLinkClass('/admin/email-templates')} onclick={toggleMobileMenu}>Mail Templates</a>
				</nav>
				<div class="border-t border-slate-200/10 pt-4">
					<a href="/logout" class="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition duration-150">Sign Out</a>
				</div>
			</div>
		</div>
	{/if}

	<!-- Content Area -->
	<div class="flex-grow md:ml-64 p-6 md:p-10 min-h-screen relative flex flex-col">
		<div class="max-w-6xl w-full mx-auto flex-grow flex flex-col">
			{@render children()}
		</div>
	</div>
</div>
