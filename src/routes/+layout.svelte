<script>
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();

	// Read initial theme preference (defaulting to dark for premium aesthetics)
	let theme = $state('dark');

	let themeMenuOpen = $state(false);

	onMount(() => {
		const storedTheme = localStorage.getItem('theme') || 'dark';
		theme = storedTheme;
		applyTheme();
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		applyTheme();
	}

	function applyTheme() {
		// Reset all theme classes first
		document.documentElement.classList.remove('dark', 'light');
		
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.add('light');
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Nexora - Centralized Internship Nexus</title>
</svelte:head>

<!-- Premium background mesh that responds to light/dark themes -->
<div class="min-h-screen text-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 relative overflow-x-hidden flex flex-col">
	<!-- Ambient Background Glows -->
	<div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none"></div>
	<div class="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[180px] pointer-events-none"></div>

	<!-- Theme toggler float button (Bottom Left) -->
	<div class="fixed bottom-6 left-6 z-50">
		<button
			onclick={toggleTheme}
			class="p-4 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-xl border border-slate-200 dark:border-slate-800 hover:scale-110 active:scale-95 transition duration-300 text-slate-800 dark:text-slate-200 cursor-pointer flex items-center justify-center"
			aria-label="Toggle Theme Menu"
		>
			{#if theme === 'dark'}
				<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
			{/if}
		</button>
	</div>

	<!-- Main Router Output -->
	<main class="flex-grow flex flex-col relative z-10">
		{@render children()}
	</main>
</div>
