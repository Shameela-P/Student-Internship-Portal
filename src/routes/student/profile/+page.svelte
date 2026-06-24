<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	const student = $derived(data.student);

	let profileLoading = $state(false);
	let resumeLoading = $state(false);

	let feedbackMsg = $state('');
	let feedbackError = $state('');

	$effect(() => {
		if (form) {
			if (form.success) {
				feedbackMsg = form.message || 'Saved successfully!';
				feedbackError = '';
				const timer = setTimeout(() => feedbackMsg = '', 4000);
				return () => clearTimeout(timer);
			} else {
				feedbackError = form.error || 'Validation error';
				feedbackMsg = '';
			}
		}
	});
</script>

<div class="mb-8">
	<h1 class="font-display font-black text-3xl text-slate-900 dark:text-white tracking-tight">
		My Student Profile
	</h1>
	<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
		Manage your academic credentials, update your resume, and configure your placement profile details.
	</p>
</div>

<!-- Feedback Alerts -->
{#if feedbackMsg}
	<div class="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
		{feedbackMsg}
	</div>
{/if}
{#if feedbackError}
	<div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450 text-xs font-semibold flex items-center gap-2">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
		{feedbackError}
	</div>
{/if}

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
	<!-- Left Side: Profile Photo & Resume Upload -->
	<div class="space-y-8">
		<!-- Profile photo card -->
		<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center">
			<div class="h-24 w-24 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-display font-black text-3xl mx-auto uppercase border border-blue-500/20 overflow-hidden">
				{#if student.profilePhoto}
					<img src={student.profilePhoto} alt={student.fullName} class="h-24 w-24 object-cover" />
				{:else}
					{student.fullName.charAt(0)}
				{/if}
			</div>
			<h3 class="font-display font-bold text-lg text-slate-900 dark:text-white mt-4">{student.fullName}</h3>
			<span class="text-xs text-slate-600 dark:text-slate-400 block mt-0.5">{student.email}</span>
		</div>

		<!-- Resume Update Card -->
		<div class="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
			<h3 class="font-display font-bold text-base text-slate-900 dark:text-white mb-4">
				Resume Document
			</h3>
			
			<div class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-xs mb-4">
				<div class="flex items-center gap-2 mb-2 text-slate-300 font-bold">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
					Active Resume
				</div>
				<span class="text-[10px] text-slate-600 dark:text-slate-400 truncate block">{student.resumePath || 'No resume file uploaded yet'}</span>
			</div>

			<form
				action="?/updateResume"
				method="POST"
				enctype="multipart/form-data"
				use:enhance={() => {
					resumeLoading = true;
					return ({ update }) => {
						resumeLoading = false;
						update();
					};
				}}
				class="space-y-4"
			>
				<div>
					<input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required class="w-full text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20" />
				</div>

				<button
					type="submit"
					disabled={resumeLoading}
					class="w-full py-2.5 rounded-xl text-xs font-bold text-slate-900 dark:text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5 animate-pulse-slow"
				>
					{#if resumeLoading}
						<span class="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						Uploading...
					{:else}
						Upload New Resume
					{/if}
				</button>
			</form>
		</div>
	</div>

	<!-- Right Side: Details Form -->
	<div class="lg:col-span-2">
		<div class="p-8 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
			<h3 class="font-display font-bold text-lg text-slate-900 dark:text-white mb-6 pb-2 border-b border-slate-200 dark:border-slate-800">
				Edit Academic & Personal Info
			</h3>

			<form
				action="?/updateProfile"
				method="POST"
				use:enhance={() => {
					profileLoading = true;
					return ({ update }) => {
						profileLoading = false;
						update();
					};
				}}
				class="space-y-6"
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label for="fullName" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Full Name *</label>
						<input type="text" id="fullName" name="fullName" required value={student.fullName} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div>
						<label for="mobileNumber" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Mobile Number *</label>
						<input type="tel" id="mobileNumber" name="mobileNumber" required value={student.mobileNumber} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div class="md:col-span-2">
						<label for="collegeName" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">College/University Name *</label>
						<input type="text" id="collegeName" name="collegeName" required value={student.collegeName} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div>
						<label for="degreeCourse" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Degree / Course *</label>
						<input type="text" id="degreeCourse" name="degreeCourse" required value={student.degreeCourse} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div>
						<label for="department" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Department *</label>
						<input type="text" id="department" name="department" required value={student.department} class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950/40 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					</div>

					<div>
						<label for="yearOfStudy" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Year of Study *</label>
						<select id="yearOfStudy" name="yearOfStudy" required class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-955 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
							<option value="1" selected={student.yearOfStudy === '1'}>1st Year</option>
							<option value="2" selected={student.yearOfStudy === '2'}>2nd Year</option>
							<option value="3" selected={student.yearOfStudy === '3'}>3rd Year</option>
							<option value="4" selected={student.yearOfStudy === '4'}>4th Year</option>
							<option value="5" selected={student.yearOfStudy === '5'}>5th Year</option>
						</select>
					</div>

					<div>
						<label for="currentStatus" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Current Status *</label>
						<select id="currentStatus" name="currentStatus" required class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-955 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
							<option value="Student" selected={student.currentStatus === 'Student'}>Currently Studying (Student)</option>
							<option value="Graduate" selected={student.currentStatus === 'Graduate'}>Graduated (Graduate)</option>
						</select>
					</div>
				</div>

				<div>
					<label for="skills" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Skills Required (Comma Separated) *</label>
					<input type="text" id="skills" name="skills" required value={student.skills.join(', ')} placeholder="React, Python, Accounting" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-955 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
					<span class="text-[10px] text-slate-500 mt-1 block">Specify key skills. The recommendation engine matches internships based on these tags.</span>
				</div>

				<div>
					<label for="profilePhoto" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Profile Photo URL</label>
					<input type="text" id="profilePhoto" name="profilePhoto" value={student.profilePhoto} placeholder="https://example.com/avatar.jpg" class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-955 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500" />
				</div>

				<div>
					<label for="bio" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Bio / Personal Pitch</label>
					<textarea id="bio" name="bio" rows="3" placeholder="Briefly describe your career goals and what makes you a great candidate..." class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-955 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">{student.bio || ''}</textarea>
				</div>

				<div>
					<label for="address" class="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">Contact Address *</label>
					<textarea id="address" name="address" required rows="3" placeholder="Residential contact details..." class="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-955 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">{student.address}</textarea>
				</div>

				<button
					type="submit"
					disabled={profileLoading}
					class="w-full py-3.5 rounded-xl font-bold text-slate-900 dark:text-white bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10 disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
				>
					{#if profileLoading}
						<span class="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
						Saving Profile Details...
					{:else}
						Save Profile Changes
					{/if}
				</button>
			</form>
		</div>
	</div>
</div>
