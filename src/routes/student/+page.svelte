<script>
	let { data } = $props();

	const student = $derived(data.student);
	const applications = $derived(data.applications);
	const stats = $derived(data.stats);
	const recommendations = $derived(data.recommendations);
</script>

<!-- Greeting Section -->
<div class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
	<div>
		<h1 class="font-display font-black text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
			Welcome, {student.fullName}!
		</h1>
		<p class="text-sm text-slate-500 dark:text-slate-400 mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
			<span>{student.degreeCourse} in {student.department}</span>
			<span class="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
			<span>{student.collegeName}</span>
		</p>
	</div>
	
	<!-- Profile Photo/Avatar -->
	<div class="flex items-center gap-3">
		<div class="text-right">
			<span class="text-xs font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Current Status</span>
			<span class="inline-flex items-center gap-1.5 mt-1 text-sm font-bold text-emerald-500">
				<span class="h-2 w-2 rounded-full bg-emerald-500"></span>
				{student.currentStatus}
			</span>
		</div>
	</div>
</div>

<!-- Statistics Cards -->
<div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
	<!-- Card 1 -->
	<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 hover:scale-[1.01] transition duration-200">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied</span>
		<h2 class="font-display font-black text-3xl text-indigo-600 dark:text-indigo-400 mt-3">{stats.totalApplied}</h2>
		<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Total applications submitted</p>
	</div>

	<!-- Card 2 -->
	<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 hover:scale-[1.01] transition duration-200">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Approved</span>
		<h2 class="font-display font-black text-3xl text-emerald-500 mt-3">{stats.approvedCount}</h2>
		<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Hired & active contracts</p>
	</div>

	<!-- Card 3 -->
	<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 hover:scale-[1.01] transition duration-200">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending</span>
		<h2 class="font-display font-black text-3xl text-amber-500 mt-3">{stats.pendingCount}</h2>
		<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Under review / Shortlisted</p>
	</div>

	<!-- Card 4 -->
	<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 hover:scale-[1.01] transition duration-200">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Certificates</span>
		<h2 class="font-display font-black text-3xl text-pink-500 mt-3">{stats.certificatesCount}</h2>
		<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Issued completion documents</p>
	</div>
</div>

<!-- Recommendation System Block -->
<div class="mb-10">
	<div class="flex items-center justify-between mb-6">
		<h2 class="font-display font-bold text-xl text-slate-900 dark:text-white">
			Recommended for Your Skill Set
		</h2>
		<a href="/student/internships" class="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:underline">
			Browse All Postings
		</a>
	</div>

	{#if recommendations.length === 0}
		<div class="p-8 rounded-2xl glass border border-slate-200/10 dark:border-slate-800/40 text-center">
			<p class="text-sm text-slate-500 dark:text-slate-400">
				No matching active recommendations found. Try adding more skills to your profile.
			</p>
			<a href="/student/profile" class="mt-4 inline-block px-4 py-2 bg-indigo-600 text-slate-900 dark:text-white rounded-xl text-xs font-bold">
				Update Skills
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each recommendations as intern}
				<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
					<!-- Match percentage tag -->
					<div class="absolute top-4 right-4 py-1.5 px-3 rounded-full text-[10px] font-black tracking-wider flex items-center gap-1.5 {intern.matchScore >= 80 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}">
						<span class="h-1.5 w-1.5 rounded-full {intern.matchScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
						{intern.matchScore}% MATCH
					</div>

					<div class="pt-4">
						<span class="text-xs text-slate-600 dark:text-slate-400 block truncate">{intern.domain}</span>
						<h3 class="font-display font-bold text-base text-slate-900 dark:text-white mt-2 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition truncate">
							{intern.title}
						</h3>
						<span class="text-xs font-semibold text-slate-500 block mt-1">{intern.companyName}</span>

						<div class="flex items-center gap-4 mt-5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
							<span class="bg-slate-200/50 dark:bg-slate-800/50 px-2 py-1 rounded">{intern.mode}</span>
							{#if intern.stipendAmount > 0}
								<span class="text-emerald-500">₹{intern.stipendAmount}/mo</span>
							{:else}
								<span>Unpaid</span>
							{/if}
						</div>
					</div>

					<div class="mt-6 pt-4 border-t border-slate-200/10 dark:border-slate-800/40 flex items-center justify-between">
						<span class="text-[10px] text-slate-600 dark:text-slate-400">Apply by: {intern.lastDateToApply}</span>
						<a
							href="/student/internships"
							class="text-xs font-bold text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 flex items-center gap-1 cursor-pointer"
						>
							Apply
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
						</a>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- My Applications section -->
<div>
	<h2 class="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">
		My Internship Applications
	</h2>

	{#if applications.length === 0}
		<div class="p-12 rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40 text-center flex flex-col items-center">
			<div class="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="12" height="12" x="4" y="4" rx="2"/></svg>
			</div>
			<p class="text-sm font-semibold text-slate-600 dark:text-slate-400">You haven't applied for any internships yet.</p>
			<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">Explore our listings and kickstart your career today!</p>
			<a
				href="/student/internships"
				class="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-slate-900 dark:text-white font-bold text-sm hover:bg-indigo-500 shadow-md shadow-indigo-500/10 transition"
			>
				Explore Internships
			</a>
		</div>
	{:else}
		<div class="space-y-4">
			{#each applications as app}
				<div class="p-6 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
					
					<!-- Left info -->
					<div class="flex-grow min-w-0">
						<div class="flex flex-wrap items-center gap-2">
							<span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{app.domain}</span>
							<span class="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
							<span class="text-xs text-slate-600 dark:text-slate-400">{app.mode} • {app.duration}</span>
						</div>
						<h3 class="font-display font-bold text-lg text-slate-900 dark:text-white mt-1.5 truncate">
							{app.internshipTitle}
						</h3>
						<span class="text-xs font-semibold text-slate-500 block mt-0.5">{app.companyName}</span>
					</div>

					<!-- Middle: Application Tracker -->
					<div class="flex items-center gap-4 lg:gap-8 bg-slate-100/50 dark:bg-slate-900/40 px-5 py-3 rounded-2xl border border-slate-200/5 dark:border-slate-800/20 max-w-md w-full">
						<!-- Status steps indicator -->
						<div class="flex items-center justify-between w-full relative">
							<!-- Connector line -->
							<div class="absolute top-[9px] left-3 right-3 h-0.5 bg-slate-200 dark:bg-slate-800 z-0"></div>

							<!-- Step 1: Submitted -->
							<div class="flex flex-col items-center z-10 text-center">
								<span class="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-black bg-indigo-600 text-slate-900 dark:text-white ring-4 ring-indigo-500/10">✓</span>
								<span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1.5">Submitted</span>
							</div>

							<!-- Step 2: Under Review / Shortlisted -->
							<div class="flex flex-col items-center z-10 text-center">
								{#if app.status === 'Shortlisted' || app.status === 'Approved' || app.status === 'Rejected'}
									<span class="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-black bg-indigo-600 text-slate-900 dark:text-white ring-4 ring-indigo-500/10">✓</span>
								{:else}
									<span class="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-500">2</span>
								{/if}
								<span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1.5">Review</span>
							</div>

							<!-- Step 3: Outcome -->
							<div class="flex flex-col items-center z-10 text-center">
								{#if app.status === 'Approved'}
									<span class="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-black bg-emerald-500 text-slate-900 dark:text-white ring-4 ring-emerald-500/10">✓</span>
									<span class="text-[9px] font-bold text-emerald-500 mt-1.5">Hired</span>
								{:else}
									{#if app.status === 'Rejected'}
										<span class="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-black bg-rose-500 text-slate-900 dark:text-white ring-4 ring-rose-500/10">✕</span>
										<span class="text-[9px] font-bold text-rose-500 mt-1.5">Closed</span>
									{:else}
										<span class="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-500">3</span>
										<span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1.5">Outcome</span>
									{/if}
								{/if}
							</div>
						</div>
					</div>

					<!-- Right: Actions & Badges -->
					<div class="flex items-center gap-3 justify-end shrink-0">
						<!-- Status Badge -->
						{#if app.status === 'Approved'}
							<span class="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Approved</span>
						{:else if app.status === 'Rejected'}
							<span class="px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">Rejected</span>
						{:else if app.status === 'Shortlisted'}
							<span class="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">Shortlisted</span>
						{:else}
							<span class="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">Pending</span>
						{/if}

						<!-- Certificate Trigger -->
						{#if app.status === 'Approved' && app.certificateHash}
							<a
								href={`/student/certificates?hash=${app.certificateHash}`}
								class="p-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/10 hover:border-pink-500/20 hover:scale-105 transition duration-150 cursor-pointer"
								title="Download Internship Certificate"
							>
								<!-- Certificate icon -->
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M7 12h10"/><path d="M12 7v10"/></svg>
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
