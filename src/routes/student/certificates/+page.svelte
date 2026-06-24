<script>
	import { page } from '$app/state';

	let { data } = $props();

	const activeCert = $derived(data.activeCertificate);
	const completedApps = $derived(data.completedApplications);
	const hashError = $derived(data.hashError);
	const hash = $derived(data.hash);

	let shareSuccess = $state(false);

	function triggerPrint() {
		window.print();
	}

	function shareCertificate(certHash) {
		const url = `${window.location.origin}/student/certificates?hash=${certHash}`;
		navigator.clipboard.writeText(url).then(() => {
			shareSuccess = true;
			setTimeout(() => {
				shareSuccess = false;
			}, 3000);
		});
	}
</script>

<style>
	@media print {
		/* Hide everything except the print-section */
		body * {
			visibility: hidden;
		}
		.print-section, .print-section * {
			visibility: visible;
		}
		.print-section {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			border: none !important;
			box-shadow: none !important;
			background: white !important;
			color: black !important;
		}
		.no-print {
			display: none !important;
		}
	}
</style>

<!-- Case 1: Specific Certificate Viewer -->
{#if activeCert}
	<div class="mb-6 no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
		<div>
			<a href="/student/certificates" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white mb-2 transition cursor-pointer">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><line x1="19" x2="5" y1="12" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
				Back to Certificates List
			</a>
			<h1 class="font-display font-black text-2xl text-slate-900 dark:text-white tracking-tight">
				Digital Certificate Preview
			</h1>
		</div>

		<div class="flex items-center gap-2">
			<!-- Print/Download -->
			<button
				onclick={triggerPrint}
				class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14" rx="1" ry="1"/></svg>
				Download / Print
			</button>
			<!-- Share -->
			<button
				onclick={() => shareCertificate(activeCert.hash)}
				class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-900 text-slate-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
				{shareSuccess ? 'Link Copied!' : 'Share Certificate'}
			</button>
		</div>
	</div>

	<!-- Formal Completion Certificate Card -->
	<div class="flex-grow flex items-center justify-center p-2 md:p-6 select-none">
		<div class="print-section w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-900 border-8 border-double border-slate-200 dark:border-slate-800 p-8 md:p-16 shadow-2xl relative flex flex-col justify-between aspect-[1.414/1] text-slate-850 dark:text-slate-200 overflow-hidden">
			
			<!-- Decorative Gold Corner Overlays -->
			<div class="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-amber-500/20"></div>
			<div class="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-amber-500/20"></div>
			<div class="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-amber-500/20"></div>
			<div class="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-amber-500/20"></div>
			
			<!-- Subtle Watermark Seal -->
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[100px] text-slate-100 dark:text-slate-800/10 pointer-events-none tracking-widest leading-none rotate-[20deg] select-none uppercase">
				Nexora
			</div>

			<!-- Top Header -->
			<div class="text-center relative z-10">
				<div class="flex items-center justify-center gap-2 mb-3">
					<div class="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-display text-slate-900 dark:text-white font-black text-base shadow-sm">
						N
					</div>
					<span class="font-display font-black text-lg tracking-wider uppercase text-slate-900 dark:text-white">Nexora Network</span>
				</div>
				<h4 class="text-[10px] font-black tracking-[0.25em] text-amber-500 uppercase">Certificate of Placement Completion</h4>
			</div>

			<!-- Main Text Body -->
			<div class="text-center my-6 md:my-10 relative z-10">
				<p class="text-xs font-semibold italic text-slate-600 dark:text-slate-400 dark:text-slate-500">This is proudly presented to</p>
				
				<h2 class="font-display font-black text-3xl md:text-5xl my-4 bg-gradient-to-r from-amber-600 to-amber-500 text-gradient tracking-tight">
					{data.student.fullName}
				</h2>

				<p class="text-xs md:text-sm max-w-xl mx-auto leading-relaxed text-slate-600 dark:text-slate-350">
					for successfully completing a corporate placement contract as a <strong class="text-slate-900 dark:text-white font-bold">{activeCert.internshipTitle}</strong> at 
					<strong class="text-slate-900 dark:text-white font-bold">{activeCert.companyName}</strong>. 
					The placement was completed over a duration of <span class="underline underline-offset-4 decoration-amber-500/30 font-bold">{activeCert.duration}</span> under active technical engineering supervision.
				</p>
			</div>

			<!-- Bottom Signatures & Verifications -->
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-10 border-t border-slate-200 dark:border-slate-800/60 pt-6 mt-4">
				<!-- Left Signee -->
				<div class="text-center md:text-left flex flex-col items-center md:items-start">
					<span class="font-display font-semibold italic text-slate-700 dark:text-slate-300 text-xs">Hiring Representative</span>
					<div class="h-0.5 w-32 bg-slate-300 dark:bg-slate-700 my-1.5"></div>
					<span class="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">{activeCert.companyName}</span>
				</div>

				<!-- Middle Verification Seal -->
				<div class="flex flex-col items-center">
					<div class="h-14 w-14 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 border-4 border-double border-white dark:border-slate-900 shadow-lg flex items-center justify-center font-display font-black text-slate-900 dark:text-white text-[10px]">
						VERIFIED
					</div>
					<span class="text-[8px] font-bold text-slate-500 mt-2 tracking-wider">NEXORA ECOSYSTEM VALIDATED</span>
				</div>

				<!-- Right Signee -->
				<div class="text-center md:text-right flex flex-col items-center md:items-end">
					<span class="font-display font-semibold italic text-slate-700 dark:text-slate-300 text-xs">Nexora Registrar</span>
					<div class="h-0.5 w-32 bg-slate-300 dark:bg-slate-700 my-1.5"></div>
					<span class="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Administrative Board</span>
				</div>
			</div>

			<!-- Absolute Bottom Hash Verify footer -->
			<div class="text-center mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/40 text-[9px] text-slate-500 flex flex-col md:flex-row items-center justify-center gap-2">
				<span>Verification Hash: <code class="text-amber-500 font-mono font-semibold">{activeCert.hash}</code></span>
				<span class="hidden md:inline">•</span>
				<span>Completion Date: <strong class="text-slate-700 dark:text-slate-300">{new Date(activeCert.issueDate).toLocaleDateString()}</strong></span>
				<span class="hidden md:inline">•</span>
				<span class="text-emerald-500 font-bold">Status: Officially Authenticated</span>
			</div>
		</div>
	</div>

<!-- Case 2: Specific Certificate Requested but Pending / Error -->
{:else}
	{#if hash}
		<!-- Beautiful Pending status card instead of a raw 400 error -->
		<div class="max-w-xl mx-auto my-12 p-8 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center backdrop-blur-sm shadow-xl">
			<div class="h-16 w-16 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
				<!-- clock icon SVG -->
				<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			
			<h2 class="font-display font-black text-2xl text-slate-900 dark:text-white tracking-tight">
				Placement Certificate Pending
			</h2>
			<p class="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
				{hashError || 'The corporate registrar has approved your placement details, and your digital certificate is currently being compiled. No action is required.'}
			</p>
			
			<div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
				<a href="/student/certificates" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-900 dark:text-white font-bold text-xs shadow-md transition duration-200">
					View My Certificates
				</a>
				<a href="/student" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white font-bold text-xs transition duration-200">
					Return to Dashboard
				</a>
			</div>
		</div>

	<!-- Case 3: Certificates Dashboard / List Directory -->
	{:else}
		<div class="mb-8">
			<h1 class="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
				My Placement Credentials
			</h1>
			<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
				Access, share, and verify all completion certificates issued by corporate hosts.
			</p>
		</div>

		{#if completedApps.length === 0}
			<div class="p-12 rounded-2xl bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 text-center flex flex-col items-center">
				<div class="h-12 w-12 rounded-xl bg-slate-950 text-slate-500 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-800">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
				</div>
				<p class="text-sm font-semibold text-slate-450">No credentials generated yet</p>
				<p class="text-xs text-slate-500 mt-1">Once you complete a placement program, your certificates will be shown here.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				{#each completedApps as app}
					<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 hover:border-slate-200 dark:border-slate-800 transition duration-200 flex flex-col justify-between">
						<div>
							<div class="flex items-center justify-between mb-4">
								<span class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-slate-850 text-slate-600 dark:text-slate-400">
									Completed Program
								</span>
								{#if app.certificateHash}
									<span class="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
										Verified
									</span>
								{:else}
									<span class="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
										Pending Release
									</span>
								{/if}
							</div>

							<h3 class="font-display font-bold text-base text-slate-900 dark:text-white truncate">{app.internshipTitle}</h3>
							<p class="text-xs text-slate-600 dark:text-slate-400 mt-1">{app.companyName} • {app.duration}</p>

							<div class="mt-4 space-y-2 text-[11px] text-slate-500">
								<div>
									<span class="font-bold text-slate-650 uppercase text-[9px]">Certificate ID:</span>
									<span class="font-mono text-slate-600 dark:text-slate-400">{app.certificateHash ? `NX-${app.certificateHash.substring(0, 8).toUpperCase()}` : 'Generating...'}</span>
								</div>
								<div>
									<span class="font-bold text-slate-650 uppercase text-[9px]">Issued Date:</span>
									<span class="text-slate-600 dark:text-slate-400">{app.completionDate !== 'Pending Generation' ? new Date(app.completionDate).toLocaleDateString() : 'Awaiting corporate action'}</span>
								</div>
							</div>
						</div>

						<div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/50 flex items-center justify-end gap-2.5">
							{#if app.certificateHash}
								<button
									onclick={() => shareCertificate(app.certificateHash)}
									class="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-[10px] font-bold text-slate-300 transition cursor-pointer"
								>
									Copy Verify Link
								</button>
								<a
									href={`/student/certificates?hash=${app.certificateHash}`}
									class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-slate-900 dark:text-white transition cursor-pointer"
								>
									View Certificate
								</a>
							{:else}
								<span class="text-[10px] font-bold text-slate-500 italic">Certificate Pending generation by company</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
{/if}
