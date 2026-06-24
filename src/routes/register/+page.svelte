<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	// Select registration type (Student vs Company)
	let activeTab = $state(data.role === 'company' ? 'company' : 'student');
	let loading = $state(false);

	const industries = [
		'Software & IT',
		'Engineering',
		'Commerce & Finance',
		'Business & Management',
		'Marketing & Sales',
		'Design & Creative Arts',
		'Media & Communication',
		'Healthcare & Medical',
		'Education & Research',
		'Arts, Literature & Languages',
		'Social Sciences',
		'Law & Governance',
		'Agriculture & Environment',
		'Hospitality & Tourism',
		'Emerging Domains',
		'Government & Public Services'
	];
</script>

<div class="min-h-screen py-12 px-4 md:px-8 flex items-center justify-center relative">
	<!-- Ambient Background Glows -->
	<div class="absolute top-10 left-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse-slow"></div>
	<div class="absolute bottom-10 right-10 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none"></div>

	<!-- Glassmorphic Card Container -->
	<div class="w-full max-w-2xl rounded-3xl glass p-8 md:p-10 shadow-2xl relative border border-slate-200/20 dark:border-slate-800/40">
		<!-- Back to home -->
		<a href="/" class="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 mb-6 transition cursor-pointer">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
			Back to home
		</a>

		<div class="text-center mb-8">
			<h1 class="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
				Create Your Nexora Account
			</h1>
			<p class="text-sm text-slate-500 dark:text-slate-400 mt-2">
				Join our platform to expand your opportunities.
			</p>
		</div>

		<!-- Form Tabs -->
		<div class="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/60 rounded-2xl mb-8 border border-slate-200/5 dark:border-slate-800/40">
			<button
				type="button"
				onclick={() => activeTab = 'student'}
				class="py-3 rounded-xl text-sm font-bold transition duration-200 cursor-pointer {activeTab === 'student' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}"
			>
				Student Registration
			</button>
			<button
				type="button"
				onclick={() => activeTab = 'company'}
				class="py-3 rounded-xl text-sm font-bold transition duration-200 cursor-pointer {activeTab === 'company' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}"
			>
				Company Registration
			</button>
		</div>

		<!-- Error Feedback -->
		{#if form?.error}
			<div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
				{form.error}
			</div>
		{/if}

		<!-- Student Registration Form -->
		{#if activeTab === 'student'}
			<form
				action="?/registerStudent"
				method="POST"
				enctype="multipart/form-data"
				use:enhance={() => {
					loading = true;
					return ({ update }) => {
						loading = false;
						update();
					};
				}}
				class="space-y-6"
			>
				<!-- Section title -->
				<div class="border-b border-slate-200/10 pb-2 mb-4">
					<h3 class="text-xs font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Personal Details</h3>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label for="fullName" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
						<input type="text" id="fullName" name="fullName" required placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="email" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address *</label>
						<input type="email" id="email" name="email" required placeholder="john@example.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="mobileNumber" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mobile Number *</label>
						<input type="tel" id="mobileNumber" name="mobileNumber" required placeholder="9876543210" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="password" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password *</label>
						<input type="password" id="password" name="password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>
				</div>

				<div class="border-b border-slate-200/10 pb-2 mb-4 pt-4">
					<h3 class="text-xs font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Academic & Qualifications</h3>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div class="md:col-span-2">
						<label for="collegeName" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">College/University Name *</label>
						<input type="text" id="collegeName" name="collegeName" required placeholder="IIT Madras, NIT Trichy, etc." class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="degreeCourse" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Degree / Course *</label>
						<input type="text" id="degreeCourse" name="degreeCourse" required placeholder="B.E, B.Tech, M.B.A, B.Com" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="department" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Department *</label>
						<input type="text" id="department" name="department" required placeholder="Computer Science, Mechanical, Finance" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="yearOfStudy" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Year of Study *</label>
						<select id="yearOfStudy" name="yearOfStudy" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none">
							<option value="1">1st Year</option>
							<option value="2">2nd Year</option>
							<option value="3">3rd Year</option>
							<option value="4">4th Year</option>
							<option value="5">5th Year</option>
						</select>
					</div>

					<div>
						<label for="currentStatus" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Current Status *</label>
						<select id="currentStatus" name="currentStatus" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none">
							<option value="Student">Currently Studying (Student)</option>
							<option value="Graduate">Graduated (Graduate)</option>
						</select>
					</div>
				</div>

				<div class="border-b border-slate-200/10 pb-2 mb-4 pt-4">
					<h3 class="text-xs font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Resume & Professional Profile</h3>
				</div>

				<div class="space-y-4">
					<div>
						<label for="resume" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Upload Resume (PDF/DOC) *</label>
						<input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required class="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-600 dark:file:bg-indigo-500/20 dark:file:text-indigo-400 hover:file:bg-indigo-500/20" />
					</div>

					<div>
						<label for="skills" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Skills (Comma Separated) *</label>
						<input type="text" id="skills" name="skills" required placeholder="React, Node.js, Python, Figma, Accounting" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="profilePhoto" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Profile Photo URL (Optional)</label>
						<input type="text" id="profilePhoto" name="profilePhoto" placeholder="https://example.com/avatar.jpg" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="address" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Contact Address *</label>
						<textarea id="address" name="address" required rows="3" placeholder="Flat No, Street Name, City, Pincode" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"></textarea>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full py-4 rounded-xl font-bold text-slate-900 dark:text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
				>
					{#if loading}
						<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						Registering Profile...
					{:else}
						Complete Student Registration
					{/if}
				</button>
			</form>
		{:else}
			<!-- Company Registration Form -->
			<form
				action="?/registerCompany"
				method="POST"
				use:enhance={() => {
					loading = true;
					return ({ update }) => {
						loading = false;
						update();
					};
				}}
				class="space-y-6"
			>
				<div class="border-b border-slate-200/10 pb-2 mb-4">
					<h3 class="text-xs font-bold text-slate-600 dark:text-slate-400 dark:text-slate-500 uppercase tracking-widest">Company Identification</h3>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label for="companyName" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Name *</label>
						<input type="text" id="companyName" name="companyName" required placeholder="Google, TechNova Solutions, etc." class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="companyEmail" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Corporate Email Address *</label>
						<input type="email" id="companyEmail" name="companyEmail" required placeholder="recruiting@company.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="companyContactNumber" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Contact Number *</label>
						<input type="tel" id="companyContactNumber" name="companyContactNumber" required placeholder="044-1234567" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>

					<div>
						<label for="website" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Corporate Website *</label>
						<input type="url" id="website" name="website" required placeholder="https://mycompany.com" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label for="industryType" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Industry Sector *</label>
						<select id="industryType" name="industryType" required class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-500 focus:outline-none">
							{#each industries as industry}
								<option value={industry}>{industry}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="companyLogo" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Logo URL (Optional)</label>
						<input type="text" id="companyLogo" name="companyLogo" placeholder="https://example.com/logo.png" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
					</div>
				</div>

				<div>
					<label for="password" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Account Password *</label>
					<input type="password" id="password" name="password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none" />
				</div>

				<div>
					<label for="companyDescription" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Company Description *</label>
					<textarea id="companyDescription" name="companyDescription" required rows="3" placeholder="Briefly describe what your organization does..." class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"></textarea>
				</div>

				<div>
					<label for="companyAddress" class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Corporate HQ Address *</label>
					<textarea id="companyAddress" name="companyAddress" required rows="2" placeholder="Suite, Building, Street, City, ZIP" class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/30 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"></textarea>
				</div>

				<button
					type="submit"
					disabled={loading}
					class="w-full py-4 rounded-xl font-bold text-slate-900 dark:text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-98 transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
				>
					{#if loading}
						<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						Submitting Corporate Request...
					{:else}
						Submit Company Request
					{/if}
				</button>
			</form>
		{/if}

		<div class="mt-8 pt-6 border-t border-slate-200/10 dark:border-slate-800/40 text-center text-sm">
			<span class="text-slate-500">Already registered on Nexora?</span>
			<a href="/login" class="font-bold text-indigo-500 dark:text-indigo-400 hover:underline ml-1">
				Sign In
			</a>
		</div>
	</div>
</div>
