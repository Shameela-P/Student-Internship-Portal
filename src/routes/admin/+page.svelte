<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
	const stats = $derived(data.stats);
	const queue = $derived(data.verificationQueue);
	const logs = $derived(data.logs);
	const activeCompanies = $derived(data.activeCompanies);

	let verifyLoading = $state(false);
	let modLoading = $state(false);
	let modWarnCompany = $state(null);
</script>

<div class="mb-10">
	<h1 class="font-display font-black text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
		Administrative Control Console
	</h1>
	<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
		Nexora Platform Overview • Global statistics, vetting verification queues, and audit logs.
	</p>
</div>

<!-- Stats counter cards -->
<div class="grid grid-cols-2 lg:grid-cols-6 gap-5 mb-10">
	<div class="p-5 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Students</span>
		<h2 class="font-display font-black text-2xl text-indigo-500 mt-2">{stats.totalStudents}</h2>
		<p class="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Registered candidate profiles</p>
	</div>

	<div class="p-5 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Companies</span>
		<h2 class="font-display font-black text-2xl text-emerald-500 mt-2">{stats.totalCompanies}</h2>
		<p class="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
			Registered accounts ({stats.pendingCompaniesCount} pending)
		</p>
	</div>

	<div class="p-5 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Internships</span>
		<h2 class="font-display font-black text-2xl text-purple-500 mt-2">{stats.activeInternships}</h2>
		<p class="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Active program postings</p>
	</div>

	<div class="p-5 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applications</span>
		<h2 class="font-display font-black text-2xl text-amber-500 mt-2">{stats.totalApplications}</h2>
		<p class="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Total application documents</p>
	</div>

	<div class="p-5 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Placements</span>
		<h2 class="font-display font-black text-2xl text-pink-500 mt-2">{stats.successfulPlacements}</h2>
		<p class="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Approved selections</p>
	</div>

	<div class="p-5 rounded-2xl glass-card border border-slate-200/15 dark:border-slate-800/40 col-span-2 lg:col-span-1">
		<span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Certificates</span>
		<h2 class="font-display font-black text-2xl text-cyan-500 mt-2">{stats.certificatesGenerated}</h2>
		<p class="text-[10px] text-slate-600 dark:text-slate-400 mt-1">Issued verifications</p>
	</div>
</div>

<!-- Active Companies Moderation -->
<div class="mb-10">
	<h3 class="font-display font-bold text-xl text-slate-900 dark:text-white mb-4">
		Active Corporate Accounts Moderation
	</h3>
	<div class="overflow-x-auto rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40">
		<table class="w-full text-left text-xs">
			<thead class="bg-slate-100/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold">
				<tr>
					<th class="p-4 rounded-tl-2xl">Company Name</th>
					<th class="p-4">Email Contact</th>
					<th class="p-4">Industry Domain</th>
					<th class="p-4 rounded-tr-2xl text-right">Moderation Actions</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-200/5 dark:divide-slate-800/20 text-slate-700 dark:text-slate-300">
				{#each activeCompanies as comp}
					<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition duration-150">
						<td class="p-4 font-bold">{comp.companyName}</td>
						<td class="p-4">{comp.companyEmail}</td>
						<td class="p-4">{comp.industryType}</td>
						<td class="p-4 flex items-center justify-end gap-2">
							<button
								onclick={() => modWarnCompany = comp}
								class="px-3 py-1.5 rounded-lg border border-amber-500/10 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 font-bold transition cursor-pointer"
							>
								Warn
							</button>
							<form
								action="?/removeFakeCompany"
								method="POST"
								use:enhance={() => {
									modLoading = true;
									return ({ update }) => {
										modLoading = false;
										update();
									};
								}}
							>
								<input type="hidden" name="companyId" value={comp.id} />
								<button
									type="submit"
									disabled={modLoading}
									class="px-3 py-1.5 rounded-lg border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-bold transition cursor-pointer disabled:opacity-50"
									onclick={(e) => !confirm(`Suspend ${comp.companyName}?`) && e.preventDefault()}
								>
									Suspend
								</button>
							</form>
						</td>
					</tr>
				{/each}
				{#if activeCompanies.length === 0}
					<tr>
						<td colspan="4" class="p-8 text-center text-slate-600 dark:text-slate-400 font-semibold">No active companies found.</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
	
	<!-- Left: Verification Queue -->
	<div class="lg:col-span-2 space-y-6">
		<div class="p-6 rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40">
			<h3 class="font-display font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center justify-between">
				<span>Company Verification Queue</span>
				{#if queue.length > 0}
					<span class="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
				{/if}
			</h3>
			<p class="text-xs text-slate-500 dark:text-slate-400 mb-6">
				Vet and approve newly registered companies before they can post openings or view resumes.
			</p>

			{#if queue.length === 0}
				<div class="py-16 text-center text-xs text-slate-600 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
					Verification queue is empty. All registered companies verified.
				</div>
			{:else}
				<div class="space-y-4">
					{#each queue as comp}
						<div class="p-5 rounded-2xl bg-white/50 dark:bg-slate-950/20 border border-slate-200/5 dark:border-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div class="min-w-0 flex-grow">
								<h4 class="font-bold text-sm text-slate-800 dark:text-slate-200">{comp.companyName}</h4>
								<span class="text-xs text-slate-600 dark:text-slate-400 block truncate mt-0.5">{comp.companyEmail} • {comp.industryType}</span>
								<a href={comp.website} target="_blank" rel="noopener noreferrer" class="text-[10px] text-indigo-500 font-semibold hover:underline block mt-1">
									Visit website ↗
								</a>
							</div>

							<!-- Verification Actions -->
							<div class="flex items-center gap-2 shrink-0 justify-end">
								<form
									action="?/rejectCompany"
									method="POST"
									use:enhance={() => {
										verifyLoading = true;
										return ({ update }) => {
											verifyLoading = false;
											update();
										};
									}}
								>
									<input type="hidden" name="companyId" value={comp.id} />
									<button
										type="submit"
										disabled={verifyLoading}
										class="px-3.5 py-2 rounded-xl border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 text-xs font-bold transition cursor-pointer disabled:opacity-50"
									>
										Reject
									</button>
								</form>

								<form
									action="?/approveCompany"
									method="POST"
									use:enhance={() => {
										verifyLoading = true;
										return ({ update }) => {
											verifyLoading = false;
											update();
										};
									}}
								>
									<input type="hidden" name="companyId" value={comp.id} />
									<button
										type="submit"
										disabled={verifyLoading}
										class="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-900 dark:text-white text-xs font-bold shadow-md shadow-emerald-500/10 transition cursor-pointer disabled:opacity-50"
									>
										Approve
									</button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Right: System Activity logs stream -->
	<div class="p-6 rounded-3xl glass border border-slate-200/10 dark:border-slate-800/40 flex flex-col">
		<h3 class="font-display font-bold text-base text-slate-900 dark:text-white mb-2">
			Platform Audit Stream
		</h3>
		<p class="text-xs text-slate-500 dark:text-slate-400 mb-6">
			Live system activities and transaction logs.
		</p>

		<!-- Log list -->
		<div class="flex-grow overflow-y-auto max-h-[400px] pr-2 space-y-4">
			{#each logs as log}
				{@const actionColor = log.action.includes('FRAUD') || log.action.includes('BLOCK') ? 'text-rose-500 bg-rose-500/10' : log.action.includes('CREATE') || log.action.includes('REGISTER') ? 'text-emerald-500 bg-emerald-500/10' : 'text-indigo-500 bg-indigo-500/10'}
				<div class="p-3 bg-slate-100/40 dark:bg-slate-950/10 border border-slate-200/5 dark:border-slate-800/10 rounded-xl text-xs space-y-1.5 hover:border-slate-200/20 dark:hover:border-slate-200 dark:border-slate-800/20 transition">
					<div class="flex items-center justify-between gap-4 font-bold">
						<span class="px-2 py-0.5 rounded text-[8px] tracking-wider uppercase {actionColor}">
							{log.action}
						</span>
						<span class="text-[8px] text-slate-600 dark:text-slate-400 font-semibold">{new Date(log.timestamp).toLocaleTimeString()}</span>
					</div>
					<p class="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{log.details}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Warning Modal -->
{#if modWarnCompany}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onclick={() => modWarnCompany = null}>
		<div class="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl relative" onclick={(e) => e.stopPropagation()}>
			<button onclick={() => modWarnCompany = null} class="absolute top-4 right-4 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-900 dark:text-white cursor-pointer transition">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
			</button>

			<h3 class="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">Issue Warning</h3>
			<p class="text-xs text-slate-500 mb-4">Send a formal compliance warning to {modWarnCompany.companyName}.</p>

			<form
				action="?/sendWarningEmail"
				method="POST"
				use:enhance={() => {
					modLoading = true;
					return ({ update }) => {
						modLoading = false;
						modWarnCompany = null;
						update();
					};
				}}
				class="space-y-4"
			>
				<input type="hidden" name="companyId" value={modWarnCompany.id} />
				
				<div>
					<label for="warningMessage" class="block text-xs font-bold text-slate-500 uppercase mb-2">Warning Reason / Message</label>
					<textarea id="warningMessage" name="warningMessage" required rows="3" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500" placeholder="E.g., Suspicious activity detected..."></textarea>
				</div>

				<button
					type="submit"
					disabled={modLoading}
					class="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 dark:text-white font-bold text-sm shadow-md transition cursor-pointer disabled:opacity-50"
				>
					Send Warning Notice
				</button>
			</form>
		</div>
	</div>
{/if}
