<script>
	import { enhance } from '$app/forms';

	let { data } = $props();

	const applications = $derived(data.applications);
	const company = $derived(data.company);

	// Client-side local filtering states
	let filterStatus = $state('All'); // 'All' | 'Pending' | 'Shortlisted' | 'Approved' | 'Rejected'
	let searchName = $state('');

	const filteredApps = $derived(
		applications.filter(app => {
			if (!app.student) return false;
			const nameMatch = app.student.fullName.toLowerCase().includes(searchName.toLowerCase()) ||
			                  app.internshipTitle.toLowerCase().includes(searchName.toLowerCase());
			const statusMatch = filterStatus === 'All' || app.status === filterStatus;
			return nameMatch && statusMatch;
		})
	);

	// Detailed view drawer toggle
	let activeAppId = $state(null);
	
	// Toast Notification
	let toastMessage = $state('');

	function toggleDetails(id) {
		if (activeAppId === id) {
			activeAppId = null;
		} else {
			activeAppId = id;
		}
	}
	
	function showToast(msg) {
		toastMessage = msg;
		setTimeout(() => {
			toastMessage = '';
		}, 3000);
	}
</script>

<!-- Global Toast -->
{#if toastMessage}
	<div class="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 px-6 py-3 rounded-xl bg-emerald-500 text-white shadow-lg font-bold text-sm flex items-center gap-3">
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
		{toastMessage}
	</div>
{/if}

<div class="mb-8">
	<h1 class="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
		Applications Queue
	</h1>
	<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
		Review student profiles, inspect uploaded resume files, shortlist candidates, and approve placements.
	</p>
</div>

<!-- Filters Bar -->
<div class="p-6 rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
	
	<!-- Search input -->
	<div class="w-full md:max-w-sm relative">
		<input
			type="text"
			bind:value={searchName}
			placeholder="Search by student name or internship..."
			class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/20 text-xs focus:border-indigo-500 focus:outline-none"
		/>
		<svg class="absolute left-3 top-3 h-4 w-4 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8" stroke-width="2"/><line x1="21" x2="16.65" y1="21" y2="16.65" stroke-width="2" stroke-linecap="round"/></svg>
	</div>

	<!-- Status Tabs -->
	<div class="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-xl border border-slate-200/5 dark:border-slate-800/20">
		{#each ['All', 'Pending', 'Shortlisted', 'Approved', 'Rejected'] as status}
			<button
				onclick={() => filterStatus = status}
				class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer {filterStatus === status ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}"
			>
				{status}
			</button>
		{/each}
	</div>
</div>

{#if filteredApps.length === 0}
	<div class="p-12 rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40 text-center">
		<p class="text-sm font-semibold text-slate-600 dark:text-slate-400">No applications found matching the parameters.</p>
	</div>
{:else}
	<div class="space-y-4">
		{#each filteredApps as app}
			<div class="rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 overflow-hidden transition-all duration-200 {activeAppId === app.id ? 'ring-2 ring-indigo-500/10' : ''}">
				
				<!-- Row summary header -->
				<div class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<!-- Student and internship details -->
					<div class="flex-grow min-w-0">
						<div class="flex items-center gap-2 flex-wrap">
							<h3 class="font-display font-bold text-base text-slate-900 dark:text-white">{app.student.fullName}</h3>
							<span class="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">• {app.student.collegeName}</span>
						</div>
						<p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
							Applied for: <strong class="text-slate-700 dark:text-slate-300 font-semibold">"{app.internshipTitle}"</strong> ({app.domain})
						</p>
					</div>

					<!-- Status actions and tags -->
					<div class="flex items-center gap-3 justify-between md:justify-end shrink-0">
						<!-- Date tag -->
						<span class="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">{new Date(app.appliedDate).toLocaleDateString()}</span>
						
						<!-- Status Badge -->
						{#if app.status === 'Approved'}
							<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Approved</span>
						{:else if app.status === 'Rejected'}
							<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">Rejected</span>
						{:else if app.status === 'Shortlisted'}
							<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">Shortlisted</span>
						{:else}
							<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">Pending</span>
						{/if}

						<!-- Toggle detailed folder action -->
						<button
							onclick={() => toggleDetails(app.id)}
							class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-bold text-indigo-500 transition cursor-pointer"
						>
							{#if activeAppId === app.id}Close{:else}View Profile{/if}
						</button>
					</div>
				</div>

				<!-- Drawer profile files & actions -->
				{#if activeAppId === app.id}
					<div class="px-5 pb-6 pt-4 border-t border-slate-200/5 dark:border-slate-800/10 bg-slate-100/10 dark:bg-slate-900/10 text-xs md:text-sm">
						<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<!-- Academic profile details -->
							<div class="lg:col-span-2 space-y-4 text-xs">
								<h4 class="font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px]">Applicant Profile</h4>
								
								<div class="grid grid-cols-2 gap-x-6 gap-y-3">
									<div>
										<span class="text-slate-600 dark:text-slate-400 block">Email Address:</span>
										<a href="mailto:{app.student.email}" class="text-indigo-500 font-semibold">{app.student.email}</a>
									</div>
									<div>
										<span class="text-slate-600 dark:text-slate-400 block">Mobile Contact:</span>
										<span class="font-semibold text-slate-700 dark:text-slate-300">{app.student.mobileNumber}</span>
									</div>
									<div>
										<span class="text-slate-600 dark:text-slate-400 block">Course & Department:</span>
										<span class="font-semibold text-slate-700 dark:text-slate-300">{app.student.degreeCourse} ({app.student.department})</span>
									</div>
									<div>
										<span class="text-slate-600 dark:text-slate-400 block">Year of Study & Status:</span>
										<span class="font-semibold text-slate-700 dark:text-slate-300">Year {app.student.yearOfStudy} • {app.student.currentStatus}</span>
									</div>
									<div class="col-span-2">
										<span class="text-slate-600 dark:text-slate-400 block">Address Location:</span>
										<span class="font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{app.student.address}</span>
									</div>
								</div>

								<!-- Skills inventory -->
								<div>
									<span class="text-slate-600 dark:text-slate-400 block mb-1.5">Candidate Skills:</span>
									<div class="flex flex-wrap gap-1">
										{#each app.student.skills as skill}
											<span class="px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-800/50 text-[10px] font-semibold text-slate-600 dark:text-slate-400">{skill}</span>
										{/each}
									</div>
								</div>
							</div>

							<!-- Resume & Status modifications -->
							<div class="space-y-4">
								<h4 class="font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[10px]">Resume File & Hiring Action</h4>
								
								<!-- Resume file link -->
								{#if app.student.resumePath}
									<a
										href={`/api/resumes/${app.student.resumePath}`}
										target="_blank"
										rel="noopener noreferrer"
										class="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-950/10 flex items-center gap-3 hover:border-indigo-500/30 transition group cursor-pointer"
									>
										<div class="h-9 w-9 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center font-black text-xs">
											PDF
										</div>
										<div class="flex-grow min-w-0">
											<span class="text-[11px] font-bold text-slate-700 dark:text-slate-300 block truncate group-hover:text-indigo-500">
												View Applicant Resume
											</span>
											<span class="text-[9px] text-slate-600 dark:text-slate-400 block truncate">Opens secure browser view</span>
										</div>
									</a>
								{:else}
									<div class="p-3 rounded-lg bg-rose-500/10 text-rose-500 text-xs">No resume uploaded.</div>
								{/if}

								<!-- Certificate hashes -->
								{#if app.status === 'Approved' && app.certificateHash}
									<div class="p-3 rounded-xl bg-pink-500/5 border border-pink-500/10 text-[10px]">
										<span class="text-slate-600 dark:text-slate-400 block">Completion Certificate Issued:</span>
										<code class="text-pink-500 font-mono font-bold truncate block mt-1">{app.certificateHash}</code>
									</div>
								{/if}

								<!-- Actions change forms -->
								<form
									action="?/updateStatus"
									method="POST"
									use:enhance={({ formData }) => {
										const status = formData.get('status');
										return ({ update, result }) => {
											if (result.type === 'success') {
												showToast(`Application successfully marked as ${status}`);
											}
											update();
										};
									}}
									class="space-y-2"
								>
									<input type="hidden" name="applicationId" value={app.id} />
									<span class="text-[10px] text-slate-600 dark:text-slate-400 font-semibold block">Change Pipeline Phase:</span>
									
									<div class="grid grid-cols-2 gap-2">
										<button
											type="submit"
											name="status"
											value="Shortlisted"
											disabled={app.status === 'Shortlisted'}
											class="py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/10 hover:border-purple-500/20 text-xs font-bold transition cursor-pointer disabled:opacity-50"
										>
											Shortlist
										</button>

										<button
											type="submit"
											name="status"
											value="Approved"
											disabled={app.status === 'Approved'}
											class="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 hover:border-emerald-500/20 text-xs font-bold transition cursor-pointer disabled:opacity-50"
										>
											Approve & Sign
										</button>

										<button
											type="submit"
											name="status"
											value="Rejected"
											disabled={app.status === 'Rejected'}
											class="py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/10 hover:border-rose-500/20 text-xs font-bold transition cursor-pointer disabled:opacity-50"
										>
											Reject
										</button>

										<button
											type="submit"
											name="status"
											value="Pending"
											disabled={app.status === 'Pending'}
											class="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/10 hover:border-amber-500/20 text-xs font-bold transition cursor-pointer disabled:opacity-50"
										>
											Make Pending
										</button>
									</div>
								</form>

								{#if app.status === 'Approved' && !app.certificateHash}
									<form
										action="?/issueCertificate"
										method="POST"
										use:enhance={() => {
											return ({ update, result }) => {
												if (result.type === 'success') {
													showToast('Certificate issued and digitally signed!');
												}
												update();
											};
										}}
										class="mt-4"
									>
										<input type="hidden" name="applicationId" value={app.id} />
										<button
											type="submit"
											class="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/10 hover:border-pink-500/20 text-xs font-bold transition cursor-pointer flex justify-center items-center gap-1.5"
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
											Issue Completion Certificate
										</button>
									</form>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
