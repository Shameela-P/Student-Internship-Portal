<script>
	let { data } = $props();
	let templates = $state(data.templates);
	let selectedTemplate = $state(null);

	function selectTemplate(template) {
		selectedTemplate = { ...template };
	}

	function saveTemplate() {
		// In a real app, this would be an API call
		if (selectedTemplate.id) {
			templates = templates.map(t => t.id === selectedTemplate.id ? { ...selectedTemplate } : t);
		} else {
			selectedTemplate.id = `TEMP_${Date.now()}`;
			templates = [...templates, { ...selectedTemplate }];
		}
		selectedTemplate = null;
	}

	function createNew() {
		selectedTemplate = { id: '', name: 'New Template', subject: '', body: '' };
	}
</script>

<div class="h-[calc(100vh-8rem)] flex flex-col space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Mail Templates</h1>
			<p class="text-slate-500 dark:text-slate-400 mt-2">Configure automated email templates sent to students and companies.</p>
		</div>
		<button 
			onclick={createNew}
			class="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-900 dark:text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95 transition cursor-pointer"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
			New Template
		</button>
	</div>

	<!-- Main Content Area -->
	<div class="flex-grow flex gap-6 overflow-hidden">
		<!-- Left Pane: Template List -->
		<div class="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
			{#each templates as template}
				<button 
					onclick={() => selectTemplate(template)}
					class="w-full text-left p-5 rounded-2xl border transition duration-200 cursor-pointer {selectedTemplate?.id === template.id ? 'bg-slate-100 dark:bg-slate-800 border-indigo-500/50 shadow-md' : 'glass-card border-slate-200 dark:border-slate-800 hover:border-indigo-500/30'}"
				>
					<h3 class="font-bold text-slate-900 dark:text-white text-sm mb-1">{template.name}</h3>
					<p class="text-xs text-slate-500 dark:text-slate-400 mb-4 truncate">{template.subject}</p>
					<span class="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
						ID: {template.id}
					</span>
				</button>
			{/each}
		</div>

		<!-- Right Pane: Editor -->
		<div class="flex-grow glass-card rounded-3xl border border-slate-200 dark:border-slate-800 p-8 overflow-y-auto">
			{#if selectedTemplate}
				<div class="space-y-6">
					<div>
						<label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Template Name</label>
						<input 
							type="text" 
							bind:value={selectedTemplate.name}
							class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-indigo-500 text-sm font-semibold text-slate-900 dark:text-white"
						/>
					</div>
					<div>
						<label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Subject</label>
						<input 
							type="text" 
							bind:value={selectedTemplate.subject}
							class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-indigo-500 text-sm text-slate-900 dark:text-white"
						/>
					</div>
					<div>
						<label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Body</label>
						<textarea 
							bind:value={selectedTemplate.body}
							rows="12"
							class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-indigo-500 text-sm text-slate-900 dark:text-white resize-none"
						></textarea>
						<p class="text-[10px] text-slate-500 mt-2 font-mono">Available variables: {`{name}`}, {`{title}`}, {`{company}`}</p>
					</div>
					<div class="pt-4 flex justify-end gap-3">
						<button 
							onclick={() => selectedTemplate = null}
							class="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
						>
							Cancel
						</button>
						<button 
							onclick={saveTemplate}
							class="px-5 py-2.5 rounded-xl font-bold text-slate-900 dark:text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95 transition cursor-pointer"
						>
							Save Template
						</button>
					</div>
				</div>
			{:else}
				<div class="h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-400 dark:text-slate-500">
					<svg class="mb-4 text-slate-300 dark:text-slate-700" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
					<p class="text-sm font-semibold max-w-xs text-center">Select a template from the left to edit it, or create a new one.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
