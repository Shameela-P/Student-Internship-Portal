<script>
	import { enhance } from '$app/forms';
	
	let { data } = $props();
	const companies = $derived(data.companies);
	
	let loadingId = $state(null);
	let searchQuery = $state('');
	
	let filteredCompanies = $derived(
		companies.filter(c => 
			c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
			c.companyEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
			c.industryType.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);
</script>

<div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
	<div>
		<h1 class="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
			Company Management
		</h1>
		<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
			View and manage {companies.length} registered companies.
		</p>
	</div>
	
	<!-- Search -->
	<div class="relative w-full md:w-72">
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search companies..."
			class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
		/>
		<svg class="absolute left-3 top-3 h-4 w-4 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<circle cx="11" cy="11" r="8" stroke-width="2"/>
			<line x1="21" x2="16.65" y1="21" y2="16.65" stroke-width="2" stroke-linecap="round"/>
		</svg>
	</div>
</div>

<div class="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full text-left border-collapse">
			<thead>
				<tr class="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
					<th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Company</th>
					<th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
					<th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Industry</th>
					<th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
					<th class="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-200 dark:divide-slate-800">
				{#each filteredCompanies as comp}
					<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition duration-150">
						<td class="px-6 py-4">
							<div class="flex items-center gap-3">
								<div class="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-display font-black text-sm border border-indigo-100 dark:border-indigo-500/20">
									{comp.companyName.charAt(0)}
								</div>
								<div>
									<div class="font-bold text-sm text-slate-900 dark:text-white">{comp.companyName}</div>
									<div class="text-xs text-slate-500 mt-0.5">{new Date(comp.createdAt).toLocaleDateString()}</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4">
							<div class="text-sm font-medium text-slate-700 dark:text-slate-300">{comp.companyEmail}</div>
							<div class="text-xs text-slate-500 mt-0.5">{comp.companyContactNumber}</div>
						</td>
						<td class="px-6 py-4">
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
								{comp.industryType}
							</span>
						</td>
						<td class="px-6 py-4">
							{#if comp.status === 'Approved'}
								<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
									<div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
									Approved
								</span>
							{:else if comp.status === 'Pending'}
								<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
									<div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
									Pending
								</span>
							{:else}
								<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
									<div class="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
									Suspended
								</span>
							{/if}
						</td>
						<td class="px-6 py-4 text-right">
							<div class="flex items-center justify-end gap-2">
								<form method="POST" action="?/updateStatus" use:enhance={() => {
									loadingId = comp.id + '-approve';
									return async ({ update }) => {
										loadingId = null;
										update({ reset: false });
									};
								}}>
									<input type="hidden" name="companyId" value={comp.id} />
									<input type="hidden" name="status" value="Approved" />
									<button 
										disabled={comp.status === 'Approved' || loadingId !== null}
										class="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
										title="Approve Company"
									>
										{#if loadingId === comp.id + '-approve'}
											<span class="h-4 w-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin block"></span>
										{:else}
											<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
										{/if}
									</button>
								</form>

								<form method="POST" action="?/updateStatus" use:enhance={() => {
									loadingId = comp.id + '-suspend';
									return async ({ update }) => {
										loadingId = null;
										update({ reset: false });
									};
								}}>
									<input type="hidden" name="companyId" value={comp.id} />
									<input type="hidden" name="status" value="Suspended" />
									<button 
										disabled={comp.status === 'Suspended' || loadingId !== null}
										class="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
										title="Suspend Company"
									>
										{#if loadingId === comp.id + '-suspend'}
											<span class="h-4 w-4 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin block"></span>
										{:else}
											<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
										{/if}
									</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
				
				{#if filteredCompanies.length === 0}
					<tr>
						<td colspan="5" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
							No companies found matching "{searchQuery}"
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
