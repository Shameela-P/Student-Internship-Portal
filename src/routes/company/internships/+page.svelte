<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const internships = $derived(data.internships);
	const domains = $derived(data.domains);
	const company = $derived(data.company);
	const approved = $derived(company.status === 'Approved');

	// Modal States
	let showModal = $state(false);
	let modalMode = $state('create'); // 'create' | 'edit'
	let selectedId = $state(null);
	let loading = $state(false);
	let clientError = $state('');

	// Form States
	let title = $state('');
	let domain = $state('');
	let subCategory = $state('');
	let skillsRequired = $state('');
	let description = $state('');
	let learningOutcomes = $state('');
	let responsibilities = $state('');
	let eligibilityCriteria = $state('');
	let duration = $state('3 Months');
	let customDuration = $state('');
	let startDate = $state('');
	let lastDateToApply = $state('');
	let mode = $state('Online');
	let type = $state('Free Internship');
	let fee = $state(0);
	let stipendAmount = $state(0);
	let openings = $state(1);
	let location = $state('Remote');
	let certificateAvailable = $state('Yes');
	let jobOpportunity = $state('No');

	function openCreateModal() {
		if (!approved) return;
		modalMode = 'create';
		selectedId = null;
		clientError = '';
		
		// Reset form
		title = '';
		domain = domains[0]?.name || '';
		subCategory = '';
		skillsRequired = '';
		description = '';
		learningOutcomes = '';
		responsibilities = '';
		eligibilityCriteria = '';
		duration = '3 Months';
		customDuration = '';
		startDate = '';
		lastDateToApply = '';
		mode = 'Online';
		type = 'Free Internship';
		fee = 0;
		stipendAmount = 0;
		openings = 1;
		location = 'Remote';
		certificateAvailable = 'Yes';
		jobOpportunity = 'No';

		showModal = true;
	}

	function openEditModal(internship) {
		modalMode = 'edit';
		selectedId = internship.id;
		clientError = '';

		// Populate form
		title = internship.title;
		domain = internship.domain;
		subCategory = internship.subCategory || '';
		skillsRequired = internship.skillsRequired.join(', ');
		description = internship.description;
		learningOutcomes = internship.learningOutcomes || '';
		responsibilities = internship.responsibilities || '';
		eligibilityCriteria = internship.eligibilityCriteria || '';
		
		if (['1 Month', '2 Months', '3 Months', '6 Months'].includes(internship.duration)) {
			duration = internship.duration;
			customDuration = '';
		} else {
			duration = 'Custom';
			customDuration = internship.duration;
		}

		startDate = internship.startDate;
		lastDateToApply = internship.lastDateToApply;
		mode = internship.mode;
		type = internship.type;
		fee = internship.fee || 0;
		stipendAmount = internship.stipendAmount || 0;
		openings = internship.openings || 1;
		location = internship.location;
		certificateAvailable = internship.certificateAvailable;
		jobOpportunity = internship.jobOpportunity;

		showModal = true;
	}

	function closeModal() {
		showModal = false;
		clientError = '';
	}

	// Validate before submit
	function handleSubmit(e) {
		if (type.includes('Paid')) {
			if (fee > 6500) {
				clientError = 'Registration fee cannot exceed ₹6,500';
				e.preventDefault();
				return false;
			}
			if (fee < 0 || isNaN(fee)) {
				clientError = 'Registration fee cannot be less than ₹0';
				e.preventDefault();
				return false;
			}
		}
		clientError = '';
		loading = true;
	}
</script>

<div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
	<div>
		<h1 class="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
			Manage Internship Postings
		</h1>
		<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
			Create new placement listings, update requirements, and review existing postings.
		</p>
	</div>
	
	<!-- Post Opportunity trigger -->
	<button
		onclick={openCreateModal}
		disabled={!approved}
		class="px-5 py-3 rounded-xl text-sm font-bold text-slate-900 dark:text-white bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1.5"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="shrink-0"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
		Publish Opportunity
	</button>
</div>

<!-- Errors display -->
{#if form?.error}
	<div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
		{form.error}
	</div>
{/if}

{#if internships.length === 0}
	<div class="p-12 rounded-3xl bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 text-center flex flex-col items-center">
		<div class="h-12 w-12 rounded-full bg-slate-950 text-slate-500 flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-800">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/></svg>
		</div>
		<p class="text-sm font-semibold text-slate-600 dark:text-slate-400">No postings active yet</p>
		<p class="text-xs text-slate-500 mt-1">Click the top-right button to publish your first internship opportunity.</p>
	</div>
{:else}
	<!-- Grid listings -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		{#each internships as intern}
			{@const isExpired = intern.status === 'Closed'}
			<div class="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-900/40 hover:bg-slate-900/60 border hover:border-blue-500/30 shadow-md hover:shadow-blue-500/5 hover:-translate-y-0.5 transition duration-300 flex flex-col justify-between {isExpired ? 'opacity-70 border-slate-200 dark:border-slate-800/50' : 'border-slate-200 dark:border-slate-800/50'}">
				<div>
					<div class="flex items-start justify-between">
						<div>
							<div class="flex flex-wrap gap-1.5">
								<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
									{intern.type}
								</span>
								{#if intern.status === 'Active'}
									<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
										Active
									</span>
								{:else if intern.status === 'Closed'}
									<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20">
										Closed
									</span>
								{:else}
									<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-600 dark:text-slate-400">
										Archived
									</span>
								{/if}
							</div>
							<h3 class="font-display font-bold text-lg text-slate-900 dark:text-white mt-3.5 truncate max-w-xs">{intern.title}</h3>
							<span class="text-xs text-slate-600 dark:text-slate-400 block mt-0.5">{intern.domain} • {intern.subCategory}</span>
						</div>
					</div>

					<p class="mt-4 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-normal">{intern.description}</p>
					
					<!-- Metadata with SVG icons instead of emojis -->
					<div class="flex flex-wrap gap-x-4 gap-y-2 mt-5 text-[10px] font-bold text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/50 pt-4">
						<span class="flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
							{intern.location} ({intern.mode})
						</span>
						<span class="flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
							{intern.duration}
						</span>
						<span class="flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
							{intern.openings} Openings
						</span>
						{#if intern.stipendAmount > 0}
							<span class="text-emerald-400 font-bold">₹{intern.stipendAmount}/mo</span>
						{/if}
						{#if intern.fee > 0}
							<span class="text-rose-400 font-bold">Fee: ₹{intern.fee}</span>
						{/if}
					</div>
				</div>

				<!-- Management Operations -->
				<div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/50 flex items-center justify-between">
					<span class="text-[10px] text-slate-500 font-bold">Deadline: {intern.lastDateToApply}</span>

					<div class="flex items-center gap-2">
						<!-- Edit -->
						<button
							onclick={() => openEditModal(intern)}
							class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-slate-900 dark:text-white transition cursor-pointer"
						>
							Edit
						</button>

						<!-- Archive (Only if Active) -->
						{#if intern.status === 'Active'}
							<form
								action="?/archiveInternship"
								method="POST"
								use:enhance={() => {
									return ({ update }) => update();
								}}
							>
								<input type="hidden" name="id" value={intern.id} />
								<button
									type="submit"
									class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-[10px] font-bold text-amber-500 transition cursor-pointer"
								>
									Archive
								</button>
							</form>
						{/if}

						<!-- Delete -->
						<form
							action="?/deleteInternship"
							method="POST"
							use:enhance={() => {
								return ({ update }) => update();
							}}
							onsubmit={(e) => {
								if(!confirm('Are you sure you want to permanently delete this internship? Active applications will be removed.')) {
									e.preventDefault();
								}
							}}
						>
							<input type="hidden" name="id" value={intern.id} />
							<button
								type="submit"
								class="px-3 py-1.5 rounded-lg border border-rose-500/10 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10 text-[10px] font-bold transition cursor-pointer"
							>
								Delete
							</button>
						</form>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<!-- Form Modal -->
{#if showModal}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onclick={closeModal}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="w-full max-w-xl rounded-2xl bg-slate-900 p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto"
			onclick={(e) => e.stopPropagation()}
		>
			<button onclick={closeModal} class="absolute top-4 right-4 p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white cursor-pointer transition">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
			</button>

			<h2 class="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">
				{modalMode === 'create' ? 'Post New Internship' : 'Edit Internship Details'}
			</h2>

			{#if clientError}
				<div class="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
					{clientError}
				</div>
			{/if}

			<form
				action={modalMode === 'create' ? '?/postInternship' : '?/editInternship'}
				method="POST"
				enctype="multipart/form-data"
				use:enhance={() => {
					loading = true;
					clientError = '';
					return ({ result }) => {
						loading = false;
						if (result.type === 'failure') {
							clientError = result.data?.error || 'Validation failed';
						} else {
							closeModal();
							window.location.reload();
						}
					};
				}}
				onsubmit={handleSubmit}
				class="space-y-5"
			>
				{#if modalMode === 'edit'}
					<input type="hidden" name="id" value={selectedId} />
				{/if}

				<!-- Banner Upload -->
				<div>
					<label for="banner" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Internship Banner/Image</label>
					<input type="file" id="banner" name="banner" accept="image/*" class="w-full text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
				</div>

				<!-- Title & Domain -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="title" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Internship Title *</label>
						<input type="text" id="title" name="title" required bind:value={title} placeholder="e.g. Node.js Backend Developer" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div>
						<label for="domain" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Category Domain *</label>
						<select id="domain" name="domain" required bind:value={domain} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-350 focus:outline-none focus:border-blue-500">
							{#each domains as d}
								<option value={d.name}>{d.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<!-- Subcategory -->
				<div>
					<label for="subCategory" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Sub Category *</label>
					<input type="text" id="subCategory" name="subCategory" required bind:value={subCategory} placeholder="e.g. API Engineering / Interface Design" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
				</div>

				<!-- Skills -->
				<div>
					<label for="skillsRequired" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Skills Required (Comma Separated) *</label>
					<input type="text" id="skillsRequired" name="skillsRequired" required bind:value={skillsRequired} placeholder="e.g. Python, React, Svelte" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					<div class="flex flex-wrap gap-1.5 mt-2">
						{#each ['Python', 'Java', 'JavaScript', 'React', 'Svelte', 'Testing', 'SQL'] as skill}
							<button
								type="button"
								onclick={() => {
									let list = skillsRequired.split(',').map(s => s.trim()).filter(Boolean);
									if (list.includes(skill)) {
										list = list.filter(s => s !== skill);
									} else {
										list.push(skill);
									}
									skillsRequired = list.join(', ');
								}}
								class="px-2.5 py-1 rounded-lg text-[10px] font-bold transition border {skillsRequired.split(',').map(s => s.trim()).includes(skill) ? 'bg-blue-600 border-blue-600 text-slate-900 dark:text-white' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/30'}"
							>
								{skill}
							</button>
						{/each}
					</div>
				</div>

				<!-- Descriptions -->
				<div>
					<label for="description" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Internship Description *</label>
					<textarea id="description" name="description" required rows="3" bind:value={description} placeholder="Describe daily tasks and expectations..." class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"></textarea>
				</div>

				<div>
					<label for="learningOutcomes" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Learning Outcomes (Optional)</label>
					<textarea id="learningOutcomes" name="learningOutcomes" rows="2" bind:value={learningOutcomes} placeholder="What knowledge will the student gain?" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"></textarea>
				</div>

				<div>
					<label for="responsibilities" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Responsibilities *</label>
					<textarea id="responsibilities" name="responsibilities" required rows="2" bind:value={responsibilities} placeholder="Daily responsibilities of the intern..." class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"></textarea>
				</div>

				<div>
					<label for="eligibilityCriteria" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Eligibility Criteria *</label>
					<textarea id="eligibilityCriteria" name="eligibilityCriteria" required rows="2" bind:value={eligibilityCriteria} placeholder="Who is eligible to apply?" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"></textarea>
				</div>

				<!-- Duration, Openings, Dates -->
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div>
						<label for="durationSelect" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Duration *</label>
						<select id="durationSelect" required bind:value={duration} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-900 dark:text-white focus:outline-none">
							<option value="1 Month">1 Month</option>
							<option value="2 Months">2 Months</option>
							<option value="3 Months">3 Months</option>
							<option value="6 Months">6 Months</option>
							<option value="Custom">Custom</option>
						</select>
						<input type="hidden" name="duration" value={duration === 'Custom' ? customDuration : duration} />
					</div>

					{#if duration === 'Custom'}
						<div>
							<label for="customDuration" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Custom Duration *</label>
							<input type="text" id="customDuration" name="customDuration" required bind:value={customDuration} placeholder="e.g. 5 Months" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
						</div>
					{/if}

					<div>
						<label for="openings" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Openings *</label>
						<input type="number" id="openings" name="openings" required min="1" bind:value={openings} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div>
						<label for="startDate" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Start Date *</label>
						<input type="date" id="startDate" name="startDate" required bind:value={startDate} class="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div>
						<label for="lastDateToApply" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Apply By *</label>
						<input type="date" id="lastDateToApply" name="lastDateToApply" required bind:value={lastDateToApply} class="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>
				</div>

				<!-- Mode Radio Selection -->
				<div>
					<span class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Internship Mode *</span>
					<div class="grid grid-cols-3 gap-3">
						{#each ['Online', 'Offline', 'Hybrid'] as m}
							<label class="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/20 cursor-pointer select-none text-xs font-bold transition-all hover:bg-slate-800 {mode === m ? 'border-blue-500 ring-2 ring-blue-500/10' : ''}">
								<input type="radio" name="mode" value={m} bind:group={mode} class="accent-blue-500" />
								{m}
							</label>
						{/each}
					</div>
				</div>

				<!-- Location -->
				<div>
					<label for="location" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Location *</label>
					<input type="text" id="location" name="location" required bind:value={location} placeholder="e.g. Seattle, WA" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
				</div>

				<!-- Type Radio Selection -->
				<div>
					<span class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Internship Type *</span>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
						{#each ['Free Internship', 'Paid Internship', 'Free + Stipend', 'Paid + Stipend'] as t}
							<label class="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950/20 cursor-pointer select-none text-xs font-bold transition-all hover:bg-slate-800 {type === t ? 'border-blue-500 ring-2 ring-blue-500/10' : ''}">
								<input type="radio" name="type" value={t} bind:group={type} class="accent-blue-500" />
								{t}
							</label>
						{/each}
					</div>
				</div>

				<!-- Conditional Stipend and Fee boxes (Strict validation logic & responsive layout) -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Stipend Amount (Shown only for Free + Stipend and Paid + Stipend) -->
					{#if type.includes('Stipend')}
						<div>
							<label for="stipendAmount" class="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Monthly Stipend (₹) *</label>
							<input type="number" id="stipendAmount" name="stipendAmount" required min="1" bind:value={stipendAmount} placeholder="e.g. 10000" class="w-full px-3 py-2.5 rounded-lg border border-emerald-500/35 bg-emerald-500/5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" />
						</div>
					{/if}

					<!-- Fee Amount (Shown only for Paid Internship and Paid + Stipend) -->
					{#if type.includes('Paid')}
						<div>
							<label for="fee" class="block text-xs font-bold text-rose-450 uppercase tracking-wider mb-2">Program Fee (₹, Max ₹6500) *</label>
							<input type="number" id="fee" name="fee" required min="0" max="6500" bind:value={fee} placeholder="e.g. 2500" class="w-full px-3 py-2.5 rounded-lg border border-rose-500/35 bg-rose-500/5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500" />
						</div>
					{/if}
				</div>

				<!-- Conditional Extras based on Type (Free Internship hides fee & stipend, shows certificate & job opportunity options) -->
				<div class="grid grid-cols-2 gap-4">
					{#if type === 'Free Internship' || type === 'Free + Stipend'}
						<div>
							<label for="certificateAvailable" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Certificate Provided? *</label>
							<select id="certificateAvailable" name="certificateAvailable" required bind:value={certificateAvailable} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-350 focus:outline-none focus:border-blue-500">
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>
						</div>

						<div>
							<label for="jobOpportunity" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Job Offer After Internship? *</label>
							<select id="jobOpportunity" name="jobOpportunity" required bind:value={jobOpportunity} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-350 focus:outline-none focus:border-blue-500">
								<option value="Yes">Yes (Pre-Placement Offer)</option>
								<option value="No">No Guarantee</option>
							</select>
						</div>
					{:else}
						<!-- Keep Certificate and Job Offer fields available under Additional Info for paid ones too -->
						<div>
							<label for="certificateAvailable" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Certificate Provided? *</label>
							<select id="certificateAvailable" name="certificateAvailable" required bind:value={certificateAvailable} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-350 focus:outline-none focus:border-blue-500">
								<option value="Yes">Yes</option>
								<option value="No">No</option>
							</select>
						</div>

						<div>
							<label for="jobOpportunity" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Job Offer After Internship? *</label>
							<select id="jobOpportunity" name="jobOpportunity" required bind:value={jobOpportunity} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs text-slate-350 focus:outline-none focus:border-blue-500">
								<option value="Yes">Yes (Pre-Placement Offer)</option>
								<option value="No">No Guarantee</option>
							</select>
						</div>
					{/if}
				</div>

				<!-- Actions -->
				<div class="flex gap-3 mt-8">
					<button
						type="button"
						onclick={closeModal}
						class="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white font-bold text-sm transition cursor-pointer"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={loading}
						class="flex-1 py-3.5 rounded-xl font-bold text-slate-900 dark:text-white bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
					>
						{#if loading}
							<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
							Publishing...
						{:else}
							Confirm Publish
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
