<script>
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { data } = $props();

	const companies = $derived(data.companies);
	const industries = $derived(data.industries);
	const domains = $derived(data.domains);
	const stats = $derived(data.stats);
	const filters = $derived(data.filters);

	let searchVal = $state(filters.query);
	let selectedIndustry = $state(filters.industry);
	let selectedDomain = $state(filters.domain);
	let searchLocation = $state(filters.location);
	let selectedMode = $state(filters.mode);
	let selectedType = $state(filters.type);

	let savedCompanies = $state(new Set());
	let selectedCompanyDetail = $state(null);

	// Count up state
	let companiesCount = $state(5000);
	let applicationsCount = $state(95000);
	let studentsCount = $state(45000);
	let domainsCount = $state(120);

	onMount(() => {
		// Load saved companies from localStorage if available
		const saved = localStorage.getItem('saved_companies');
		if (saved) {
			try {
				savedCompanies = new Set(JSON.parse(saved));
			} catch (e) {}
		}

		// Count-up animation
		const duration = 1500; // ms
		const steps = 30;
		const stepTime = duration / steps;
		let step = 0;

		const targetCompanies = stats.totalCompanies;
		const targetApplications = stats.totalApplications;
		const targetStudents = stats.totalStudents;
		const targetDomains = stats.totalDomains;

		const timer = setInterval(() => {
			step++;
			companiesCount = Math.floor(5000 + (targetCompanies - 5000) * (step / steps));
			applicationsCount = Math.floor(95000 + (targetApplications - 95000) * (step / steps));
			studentsCount = Math.floor(45000 + (targetStudents - 45000) * (step / steps));
			domainsCount = Math.floor(120 + (targetDomains - 120) * (step / steps));

			if (step >= steps) {
				companiesCount = targetCompanies;
				applicationsCount = targetApplications;
				studentsCount = targetStudents;
				domainsCount = targetDomains;
				clearInterval(timer);
			}
		}, stepTime);

		return () => clearInterval(timer);
	});

	function toggleSave(id) {
		if (savedCompanies.has(id)) {
			savedCompanies.delete(id);
		} else {
			savedCompanies.add(id);
		}
		savedCompanies = new Set(savedCompanies);
		localStorage.setItem('saved_companies', JSON.stringify(Array.from(savedCompanies)));
	}

	const featuredRecruiters = [
		'TCS', 'Infosys', 'Wipro', 'HCL', 'Zoho', 'Cognizant', 'Accenture', 'Capgemini', 'Tech Mahindra', 'LTIMindtree'
	];

	const successStories = [
		{
			name: 'Aditya Sharma',
			role: 'Full Stack Engineer',
			company: 'Zoho',
			quote: 'Nexora helped me find my dream placement. The verification system made it easy to trust the company and start immediately.',
			avatar: 'AS'
		},
		{
			name: 'Ananya Goel',
			role: 'Data Scientist',
			company: 'Accenture',
			quote: 'The direct chat feature let me connect with the hiring manager in real time. I got selected within 3 days of applying!',
			avatar: 'AG'
		}
	];
</script>

<style>
	@keyframes marquee {
		0% { transform: translateX(0); }
		100% { transform: translateX(-50%); }
	}
	.marquee-container {
		overflow: hidden;
		white-space: nowrap;
		display: flex;
	}
	.marquee-track {
		display: inline-flex;
		gap: 3rem;
		animation: marquee 30s linear infinite;
	}
	.marquee-track:hover {
		animation-play-state: paused;
	}

	/* Hero animations styling */
	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-15px) rotate(2deg); }
	}
	@keyframes float-reverse {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(12px) rotate(-3deg); }
	}
	@keyframes pulse-slow {
		0%, 100% { opacity: 0.2; transform: scale(1); }
		50% { opacity: 0.35; transform: scale(1.15); }
	}
	.animate-float-1 {
		animation: float 6s ease-in-out infinite;
	}
	.animate-float-2 {
		animation: float-reverse 8s ease-in-out infinite;
	}
	.animate-float-3 {
		animation: float 7s ease-in-out infinite 1s;
	}
	.animate-pulse-slow {
		animation: pulse-slow 10s ease-in-out infinite;
	}
</style>

<!-- Hero Section -->
<section class="relative py-20 px-6 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-200 dark:border-slate-800/80 mb-12 text-center shadow-2xl">
	<!-- Background Glows -->
	<div class="absolute top-[-30%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
	<div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none animate-pulse-slow" style="animation-delay: 2s;"></div>

	<!-- Interactive Floating Graphic Elements (Hero Animation) -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-40">
		<!-- Student Laptop Mock / Icon -->
		<div class="absolute top-10 left-10 md:left-20 animate-float-1 bg-slate-800/90 border border-slate-700/50 p-3 rounded-2xl shadow-xl flex items-center gap-3">
			<div class="bg-blue-500/20 text-blue-400 p-2 rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
			</div>
			<div class="text-left text-xs">
				<p class="font-bold text-slate-900 dark:text-white">Full Stack Intern</p>
				<p class="text-slate-600 dark:text-slate-400">TCS • Active</p>
			</div>
		</div>

		<!-- Floating Company Logo / Bubble -->
		<div class="absolute bottom-10 left-6 md:left-32 animate-float-2 bg-slate-800/80 border border-slate-700/50 p-2 px-3 rounded-xl shadow-lg flex items-center gap-2">
			<span class="text-cyan-400 font-bold font-display text-sm">Zoho</span>
			<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
		</div>

		<!-- Floating Certificates -->
		<div class="absolute top-8 right-8 md:right-24 animate-float-3 bg-slate-800/90 border border-slate-700/50 p-3 rounded-2xl shadow-xl flex items-center gap-3">
			<div class="bg-amber-500/20 text-amber-400 p-2 rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
				</svg>
			</div>
			<div class="text-left text-xs">
				<p class="font-bold text-slate-900 dark:text-white">Verified Certificate</p>
				<p class="text-slate-600 dark:text-slate-400">ID: NX-8902-A</p>
			</div>
		</div>

		<!-- Career Growth Graph -->
		<div class="absolute bottom-16 right-12 md:right-36 animate-float-1 bg-slate-800/90 border border-slate-700/50 p-3 rounded-2xl shadow-xl flex items-center gap-3">
			<div class="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
				</svg>
			</div>
			<div class="text-left text-xs">
				<p class="font-bold text-slate-900 dark:text-white">Career Growth</p>
				<p class="text-emerald-400">+148% Placements</p>
			</div>
		</div>
	</div>

	<div class="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
		<!-- Graphic Badge -->
		<div class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6 shadow-sm">
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
			100% Verified Corporate Partners
		</div>

		<h1 class="font-display font-black text-4xl md:text-6xl text-slate-900 dark:text-white leading-tight tracking-tight">
			Explore <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 text-gradient">5500+ Verified Companies</span>
		</h1>
		<p class="mt-5 text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
			Find internships from top recruiters, startups, and global companies across 150+ domains. Apply directly to active postings and launch your career.
		</p>

		<div class="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
			<a href="#directory" class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.02] transition-all duration-250 cursor-pointer">
				Explore Companies
			</a>
			<a href="/student/internships" class="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-slate-900 dark:text-white font-bold text-sm hover:scale-[1.02] transition-all duration-250 cursor-pointer">
				Find Internships
			</a>
		</div>
	</div>
</section>

<!-- Statistics Grid -->
<section class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
	<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-center backdrop-blur-sm relative group overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
		<span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest block">Corporate Partners</span>
		<h2 class="font-display font-black text-2xl md:text-4xl text-blue-400 mt-2">{companiesCount}+</h2>
	</div>
	<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-center backdrop-blur-sm relative group overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
		<span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest block">Applications Filed</span>
		<h2 class="font-display font-black text-2xl md:text-4xl text-emerald-400 mt-2">{applicationsCount}+</h2>
	</div>
	<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-center backdrop-blur-sm relative group overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
		<span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest block">Active Candidates</span>
		<h2 class="font-display font-black text-2xl md:text-4xl text-purple-400 mt-2">{studentsCount}+</h2>
	</div>
	<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 text-center backdrop-blur-sm relative group overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
		<span class="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest block">Domain Streams</span>
		<h2 class="font-display font-black text-2xl md:text-4xl text-cyan-400 mt-2">{domainsCount}+</h2>
	</div>
</section>

<!-- Auto Scrolling Recruiters Marquee -->
<section class="mb-16 py-5 border-y border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-900/30">
	<div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-6">
		<div class="shrink-0 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Top Recruiters:</div>
		<div class="marquee-container flex-grow">
			<div class="marquee-track">
				{#each [...featuredRecruiters, ...featuredRecruiters] as recruiter}
					<span class="text-sm font-black font-display text-slate-600 dark:text-slate-400 hover:text-blue-400 transition-colors duration-200 cursor-default">
						{recruiter}
					</span>
				{/each}
			</div>
		</div>
	</div>
</section>

<!-- Main Directory -->
<section id="directory" class="mb-16">
	<!-- Title and Filters -->
	<div class="mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
		<div>
			<h2 class="font-display font-black text-2xl text-slate-900 dark:text-white">Corporate Register</h2>
			<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Search through verified corporate registries and find matching workspaces.</p>
		</div>

		<!-- Filter Bar -->
		<form method="GET" class="w-full xl:max-w-5xl flex flex-wrap items-center gap-3">
			<!-- Name Query -->
			<div class="relative flex-grow min-w-[200px]">
				<input
					type="text"
					name="query"
					bind:value={searchVal}
					placeholder="Search company or description..."
					class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
				/>
				<svg class="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<circle cx="11" cy="11" r="8" stroke-width="2"/>
					<line x1="21" x2="16.65" y1="21" y2="16.65" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</div>

			<!-- Industry -->
			<div class="min-w-[140px]">
				<select
					name="industry"
					bind:value={selectedIndustry}
					class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
				>
					<option value="">All Sectors</option>
					{#each industries as industry}
						<option value={industry}>{industry}</option>
					{/each}
				</select>
			</div>

			<!-- Domain -->
			<div class="min-w-[140px]">
				<select
					name="domain"
					bind:value={selectedDomain}
					class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
				>
					<option value="">All Domains</option>
					{#each domains as domain}
						<option value={domain}>{domain}</option>
					{/each}
				</select>
			</div>

			<!-- Location -->
			<div class="relative min-w-[140px]">
				<input
					type="text"
					name="location"
					bind:value={searchLocation}
					placeholder="Location..."
					class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
				/>
				<svg class="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" stroke-width="2"/>
					<circle cx="12" cy="10" r="3" stroke-width="2"/>
				</svg>
			</div>

			<!-- Mode -->
			<div class="min-w-[110px]">
				<select
					name="mode"
					bind:value={selectedMode}
					class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
				>
					<option value="">All Modes</option>
					<option value="Online">Online</option>
					<option value="Offline">Offline</option>
					<option value="Hybrid">Hybrid</option>
				</select>
			</div>

			<!-- Type -->
			<div class="min-w-[130px]">
				<select
					name="type"
					bind:value={selectedType}
					class="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
				>
					<option value="">All Types</option>
					<option value="Free Internship">Free Internship</option>
					<option value="Paid Internship">Paid Internship</option>
					<option value="Free + Stipend">Free + Stipend</option>
					<option value="Paid + Stipend">Paid + Stipend</option>
				</select>
			</div>

			<!-- Buttons -->
			<div class="flex gap-2">
				<button type="submit" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold text-xs transition-colors duration-200 cursor-pointer">
					Apply Filters
				</button>
				<a href="/student/companies" class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/50 hover:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold text-xs transition duration-200 cursor-pointer flex items-center justify-center">
					Reset
				</a>
			</div>
		</form>
	</div>

	<!-- Active Filter Chips Indicator -->
	{#if filters.query || filters.industry || filters.domain || filters.location || filters.mode || filters.type}
		<div class="flex flex-wrap items-center gap-2 mb-6">
			<span class="text-xs text-slate-500 font-semibold">Active filters:</span>
			{#if filters.query}
				<span class="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold flex items-center gap-1.5">
					Search: {filters.query}
				</span>
			{/if}
			{#if filters.industry}
				<span class="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold flex items-center gap-1.5">
					Industry: {filters.industry}
				</span>
			{/if}
			{#if filters.domain}
				<span class="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold flex items-center gap-1.5">
					Domain: {filters.domain}
				</span>
			{/if}
			{#if filters.location}
				<span class="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold flex items-center gap-1.5">
					Location: {filters.location}
				</span>
			{/if}
			{#if filters.mode}
				<span class="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold flex items-center gap-1.5">
					Mode: {filters.mode}
				</span>
			{/if}
			{#if filters.type}
				<span class="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-semibold flex items-center gap-1.5">
					Type: {filters.type}
				</span>
			{/if}
		</div>
	{/if}

	<!-- Company Grid (Reduced heights by 40%, premium 3-col grids) -->
	{#if companies.length === 0}
		<div class="p-16 rounded-3xl bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 text-center flex flex-col items-center justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
			</svg>
			<p class="text-sm font-bold text-slate-600 dark:text-slate-400">No matching verified partners</p>
			<p class="text-xs text-slate-500 mt-1">Try resetting the search filters to discover more corporate agencies.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each companies as comp}
				<!-- Slick, reduced-height card with lift up, border glow, shadow transitions -->
				<div class="group p-5 rounded-2xl bg-white dark:bg-slate-900/40 hover:bg-slate-900/70 border border-slate-200 dark:border-slate-800/60 hover:border-blue-500/40 flex flex-col justify-between shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 min-h-[175px]">
					<div>
						<!-- Header -->
						<div class="flex items-start gap-3">
							<!-- Company Logo / Initials -->
							<div class="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-950 text-blue-400 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-display font-black text-sm">
								{comp.companyName.charAt(0)}
							</div>
							
							<div class="min-w-0 flex-grow">
								<div class="flex items-center gap-1.5">
									<h3 class="font-display font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-400 transition-colors duration-250">{comp.companyName}</h3>
									<!-- Verified checkmark -->
									<span class="text-blue-400 shrink-0" title="Verified Corporate Partner">
										<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
									</span>
									<span class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
										{comp.industryType}
									</span>
								</div>
								
								<div class="flex items-center gap-2 mt-1.5 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
									<!-- Location icon -->
									<span class="flex items-center gap-1">
										<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
										{comp.companyAddress.split(',').pop().trim()}
									</span>
									
									<span class="h-1 w-1 rounded-full bg-slate-800"></span>

									<span class="flex items-center gap-0.5 text-amber-500">
										<svg class="h-3 w-3 fill-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
										{comp.rating}
									</span>
								</div>
							</div>
						</div>

						<!-- Description -->
						<p class="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-normal">
							{comp.companyDescription}
						</p>
					</div>

					<!-- Footer Actions (Compact layout, short spacing) -->
					<div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
						<span class="text-[10px] text-slate-500 font-bold">
							{comp.openingsCount > 0 ? `${comp.openingsCount} Active Listings` : 'No open opportunities'}
						</span>

						<div class="flex items-center gap-3">
							<button
								onclick={() => selectedCompanyDetail = comp}
								class="text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition duration-200 cursor-pointer"
							>
								View Info
							</button>
							<a
								href={`/student/internships?query=${encodeURIComponent(comp.companyName)}`}
								class="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition duration-200 cursor-pointer"
							>
								Explore Openings
							</a>
							
							<button
								onclick={() => toggleSave(comp.id)}
								class="p-1 rounded hover:bg-slate-800 transition duration-200 cursor-pointer text-slate-500 hover:text-slate-900 dark:text-white"
								title={savedCompanies.has(comp.id) ? 'Saved' : 'Save Company'}
							>
								<svg
									class="h-3.5 w-3.5 {savedCompanies.has(comp.id) ? 'fill-blue-400 text-blue-400' : 'text-slate-500'}"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
								</svg>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<!-- Success Stories -->
<section class="mb-16 border-t border-slate-200 dark:border-slate-800/60 pt-16">
	<h2 class="font-display font-black text-2xl text-slate-900 dark:text-white text-center mb-8">Success Stories</h2>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
		{#each successStories as story}
			<div class="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 flex gap-4 backdrop-blur-sm hover:border-slate-700/60 transition duration-300">
				<div class="h-10 w-10 shrink-0 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/20">
					{story.avatar}
				</div>
				<div>
					<p class="text-xs italic text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
						"{story.quote}"
					</p>
					<div class="mt-4">
						<h4 class="text-xs font-bold text-slate-900 dark:text-white">{story.name}</h4>
						<span class="text-[10px] text-slate-500 font-semibold">{story.role} • Hired by <strong class="text-blue-400">{story.company}</strong></span>
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- Company Details Modal Drawer -->
{#if selectedCompanyDetail}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onclick={() => selectedCompanyDetail = null}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative"
			onclick={(e) => e.stopPropagation()}
		>
			<button onclick={() => selectedCompanyDetail = null} class="absolute top-4 right-4 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white cursor-pointer transition">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
			</button>

			<div class="flex items-center gap-3 mb-6">
				<div class="h-12 w-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-950 text-blue-400 flex items-center justify-center font-display font-black text-xl border border-slate-200 dark:border-slate-800">
					{selectedCompanyDetail.companyName.charAt(0)}
				</div>
				<div>
					<h3 class="font-display font-bold text-lg text-slate-900 dark:text-white">{selectedCompanyDetail.companyName}</h3>
					<span class="text-xs text-blue-400 font-bold">{selectedCompanyDetail.industryType}</span>
				</div>
			</div>

			<div class="space-y-4 text-xs text-slate-350">
				<div>
					<h4 class="font-bold text-slate-500 uppercase tracking-widest text-[9px] mb-1">Company Description</h4>
					<p class="leading-relaxed">{selectedCompanyDetail.companyDescription}</p>
				</div>
				<div>
					<h4 class="font-bold text-slate-500 uppercase tracking-widest text-[9px] mb-1">Corporate Address</h4>
					<p class="leading-relaxed">{selectedCompanyDetail.companyAddress}</p>
				</div>
				<div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800/80">
					<a href={selectedCompanyDetail.website} target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold text-[10px] transition cursor-pointer">
						Visit Corporate Website
					</a>
					<a href={`/student/internships?query=${encodeURIComponent(selectedCompanyDetail.companyName)}`} class="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-800 font-bold text-[10px] transition cursor-pointer text-slate-300 hover:text-slate-900 dark:text-white">
						Explore Openings
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Footer -->
<footer class="w-full py-8 border-t border-slate-200 dark:border-slate-800/40 text-center text-slate-500 text-[10px] mt-auto">
	<p>© 2026 Nexora Network. Hired with trust.</p>
</footer>
