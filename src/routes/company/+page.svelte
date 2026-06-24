<script>
	let { data } = $props();
	const company = $derived(data.company);
	const stats = $derived(data.stats);
	const chartData = $derived(data.barChartData);
	const recentApps = $derived(data.recentApplications);

	// Safe calculations for SVG Charts
	const maxVal = $derived(chartData.length > 0 ? Math.max(...chartData.map(d => d.value), 1) : 1);
</script>

<div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
	<div>
		<h1 class="font-display font-black text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
			Corporate Overview
		</h1>
		<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
			Recruiter Dashboard for {company.companyName} • Sector: {company.industryType}
		</p>
	</div>
	{#if company.status === 'Approved'}
		<a
			href="/company/internships"
			class="px-5 py-3 rounded-xl text-sm font-bold text-slate-900 dark:text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg shadow-indigo-500/10 flex items-center gap-1.5 transition cursor-pointer"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
			Post Internship
		</a>
	{/if}
</div>

<!-- Stats Grid -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
	<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Postings</span>
		<h2 class="font-display font-black text-3xl text-indigo-600 dark:text-indigo-400 mt-3">{stats.activePostings}</h2>
		<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Open for submissions</p>
	</div>
	
	<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Received</span>
		<h2 class="font-display font-black text-3xl text-purple-500 mt-3">{stats.totalApplications}</h2>
		<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Hiring funnel entries</p>
	</div>

	<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Audit</span>
		<h2 class="font-display font-black text-3xl text-amber-500 mt-3">{stats.pendingApplications}</h2>
		<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Awaiting reviewer feedback</p>
	</div>

	<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Shortlisted</span>
		<h2 class="font-display font-black text-3xl text-emerald-500 mt-3">{stats.shortlistedCandidates}</h2>
		<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Passed initial screenings</p>
	</div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
	<!-- SVG Chart Section -->
	<div class="lg:col-span-2 p-6 rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40 flex flex-col justify-between">
		<div>
			<h3 class="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
				Application Distribution
			</h3>
			<p class="text-xs text-slate-500 dark:text-slate-400">
				Applications count per active internship opening.
			</p>
		</div>

		{#if chartData.length === 0}
			<div class="py-16 text-center text-xs text-slate-600 dark:text-slate-400">
				No active posting data available for analysis.
			</div>
		{:else}
			<!-- SVG Bar Chart -->
			<div class="mt-8 flex flex-col gap-5">
				{#each chartData as bar}
					{@const percentage = Math.round((bar.value / maxVal) * 100)}
					<div class="space-y-1.5">
						<div class="flex items-center justify-between text-xs font-semibold">
							<span class="text-slate-700 dark:text-slate-300 truncate max-w-sm">{bar.title}</span>
							<span class="text-slate-500 dark:text-slate-400">{bar.value} applicants</span>
						</div>
						<!-- Progress bar container -->
						<div class="h-3.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden border border-slate-200/5 dark:border-slate-800/20">
							<div
								class="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
								style="width: {percentage}%"
							></div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Pipeline Summary Circular Chart (simulated with styled bars) -->
	<div class="p-6 rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40 flex flex-col justify-between">
		<div>
			<h3 class="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
				Candidate Pipeline
			</h3>
			<p class="text-xs text-slate-500 dark:text-slate-400">Current status breakdowns</p>
		</div>

		<div class="space-y-4 my-6">
			<!-- Pending -->
			<div class="flex items-center justify-between text-xs font-semibold">
				<span class="flex items-center gap-2 text-slate-500"><span class="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Pending</span>
				<span class="text-slate-800 dark:text-white">{stats.pendingApplications}</span>
			</div>
			<!-- Shortlisted -->
			<div class="flex items-center justify-between text-xs font-semibold">
				<span class="flex items-center gap-2 text-slate-500"><span class="h-2.5 w-2.5 rounded-full bg-indigo-500"></span> Shortlisted</span>
				<span class="text-slate-800 dark:text-white">{stats.shortlistedCandidates}</span>
			</div>
			<!-- Approved -->
			<div class="flex items-center justify-between text-xs font-semibold">
				<span class="flex items-center gap-2 text-slate-500"><span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Approved (Hired)</span>
				<span class="text-slate-800 dark:text-white">{stats.approvedHires}</span>
			</div>
			<!-- Rejected -->
			<div class="flex items-center justify-between text-xs font-semibold">
				<span class="flex items-center gap-2 text-slate-500"><span class="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Rejected</span>
				<span class="text-slate-800 dark:text-white">{stats.rejectedApplications}</span>
			</div>
		</div>

		<div class="border-t border-slate-200/10 dark:border-slate-800/40 pt-4 flex items-center justify-between text-xs">
			<span class="text-slate-600 dark:text-slate-400 font-semibold">Conversion Rate:</span>
			<strong class="text-emerald-500 font-bold">
				{stats.totalApplications > 0 ? Math.round((stats.approvedHires / stats.totalApplications) * 100) : 0}%
			</strong>
		</div>
	</div>
</div>

<!-- Recent Applications Section -->
<div>
	<div class="flex items-center justify-between mb-6">
		<h2 class="font-display font-bold text-xl text-slate-900 dark:text-white">
			Incoming Candidate Feed
		</h2>
		<a href="/company/applications" class="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline">
			View All Queue
		</a>
	</div>

	{#if recentApps.length === 0}
		<div class="p-12 rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40 text-center">
			<p class="text-sm text-slate-500 dark:text-slate-400">
				No applications have been received yet for your postings.
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each recentApps as app}
				<div class="p-5 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div class="flex items-center gap-2 flex-wrap">
							<span class="text-xs font-bold text-slate-900 dark:text-white">{app.studentName}</span>
							<span class="text-[10px] text-slate-600 dark:text-slate-400">• {app.studentCollege}</span>
						</div>
						<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
							Applied for: <strong class="text-slate-700 dark:text-slate-300 font-bold">"{app.internshipTitle}"</strong>
						</p>
					</div>

					<div class="flex items-center gap-4 justify-between md:justify-end">
						<span class="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">{new Date(app.appliedDate).toLocaleDateString()}</span>
						
						<!-- Badge -->
						{#if app.status === 'Approved'}
							<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Approved</span>
						{:else if app.status === 'Rejected'}
							<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">Rejected</span>
						{:else if app.status === 'Shortlisted'}
							<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">Shortlisted</span>
						{:else}
							<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">Pending</span>
						{/if}

						<a
							href="/company/applications"
							class="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer"
						>
							Manage
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
