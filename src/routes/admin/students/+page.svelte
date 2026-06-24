<script>
	let { data } = $props();
	let students = $state(data.students);
	
	let searchQuery = $state('');
	let filterTab = $state('All'); // 'All', 'Active', 'Blocked'

	const totalStudents = $derived(students.length);
	const activeAccounts = $derived(students.filter(s => !s.isSuspended).length);
	const blockedAccounts = $derived(students.filter(s => s.isSuspended).length);

	const filteredStudents = $derived(
		students.filter(s => {
			const matchesSearch = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
								  s.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
								  s.collegeName.toLowerCase().includes(searchQuery.toLowerCase());
			
			if (filterTab === 'Active' && s.isSuspended) return false;
			if (filterTab === 'Blocked' && !s.isSuspended) return false;
			
			return matchesSearch;
		})
	);

	function toggleBlock(id) {
		// In a real app, this would be an API call
		students = students.map(s => s.id === id ? { ...s, isSuspended: !s.isSuspended } : s);
	}

	function deleteStudent(id) {
		// In a real app, this would be an API call
		if(confirm('Are you sure you want to delete this student?')) {
			students = students.filter(s => s.id !== id);
		}
	}
</script>

<div class="space-y-8">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Students Board</h1>
		<p class="text-slate-500 dark:text-slate-400 mt-2">Manage and monitor all registered student accounts on the platform.</p>
	</div>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="glass-card rounded-2xl p-6 border-slate-200 dark:border-slate-800">
			<h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Students</h3>
			<p class="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-display">{totalStudents.toLocaleString()}</p>
		</div>
		<div class="glass-card rounded-2xl p-6 border-slate-200 dark:border-slate-800">
			<h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Active Accounts</h3>
			<p class="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-display">{activeAccounts.toLocaleString()}</p>
		</div>
		<div class="glass-card rounded-2xl p-6 border-slate-200 dark:border-slate-800">
			<h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Blocked</h3>
			<p class="text-4xl font-black text-rose-600 dark:text-rose-500 font-display">{blockedAccounts.toLocaleString()}</p>
		</div>
	</div>

	<!-- Search & Filters -->
	<div class="glass-card rounded-2xl p-4 border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
		<div class="relative w-full md:w-96">
			<svg class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
			<input 
				type="text" 
				bind:value={searchQuery}
				placeholder="Search by name, email, college or department..."
				class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-sm transition"
			/>
		</div>
		<div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/5 dark:border-slate-800/40">
			{#each ['All', 'Active', 'Blocked'] as tab}
				<button 
					onclick={() => filterTab = tab}
					class="px-4 py-2 rounded-lg text-xs font-bold transition duration-200 cursor-pointer {filterTab === tab ? 'bg-indigo-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}"
				>
					{tab}
				</button>
			{/each}
		</div>
	</div>

	<!-- Data Table -->
	<div class="glass-card rounded-2xl border-slate-200 dark:border-slate-800 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full text-left border-collapse">
				<thead>
					<tr class="border-b border-slate-200/50 dark:border-slate-800/50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
						<th class="px-6 py-4">Name</th>
						<th class="px-6 py-4">College</th>
						<th class="px-6 py-4">Department</th>
						<th class="px-6 py-4">Status</th>
						<th class="px-6 py-4 text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-200/50 dark:divide-slate-800/50 text-sm">
					{#each filteredStudents.slice(0, 50) as student}
						<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-100 dark:bg-slate-900/30 transition">
							<td class="px-6 py-4">
								<div class="font-bold text-slate-900 dark:text-white">{student.fullName}</div>
								<div class="text-xs text-slate-500 dark:text-slate-400">{student.email}</div>
							</td>
							<td class="px-6 py-4 text-slate-600 dark:text-slate-300">{student.collegeName}</td>
							<td class="px-6 py-4 text-slate-600 dark:text-slate-300">{student.department}</td>
							<td class="px-6 py-4">
								{#if student.isSuspended}
									<span class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">Blocked</span>
								{:else}
									<span class="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Active</span>
								{/if}
							</td>
							<td class="px-6 py-4 text-right space-x-2">
								<button 
									onclick={() => toggleBlock(student.id)}
									class="text-xs font-bold px-3 py-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition cursor-pointer"
								>
									{student.isSuspended ? 'Unblock' : 'Block'}
								</button>
								<button 
									onclick={() => deleteStudent(student.id)}
									class="text-xs font-bold px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
					{#if filteredStudents.length === 0}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
								No students found matching your criteria.
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
