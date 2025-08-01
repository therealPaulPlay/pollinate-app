<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import { ArrowLeft } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { vibrate } from "$lib/utils/vibrate";

	function goBack() {
		vibrate.light();
		const onboardingComplete = localStorage.getItem("onboardingCompleted");

		if (onboardingComplete) goto("/"); // Go home
		else goto("/onboarding"); // Go to onboarding
	}
</script>

<div class="max-h-dvh overflow-y-auto px-4 pt-[calc(1.5rem+var(--safe-top))] pb-8">
	<div class="mx-auto max-w-3xl space-y-6">
		<!-- Back Button -->
		<Button onclick={goBack} class="mb-4">
			<ArrowLeft class="h-4 w-4" />
		</Button>

		<h1 class="mt-4 font-bevellier text-5xl font-bold">Privacy Policy</h1>
		<p class="text-muted-foreground">Last updated: August 1, 2025</p>

		<div class="space-y-6">
			<section>
				<h2 class="mb-3 text-lg font-semibold">Introduction</h2>
				<p>
					This Privacy Policy describes how Pollinate ("Service") provided by Paul Rhomberg ("we," "us," or "our")
					collects, uses, and protects your information when you use our mobile application and services.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Information We Collect</h2>
				<p>To provide our pollen forecast service, we may temporarily process:</p>
				<div class="space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Location coordinates (when you input the requested location) to fetch relevant pollen data</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Basic device information for compatibility</span>
					</div>
				</div>
				<p>This information is processed temporarily and is not permanently stored on our servers.</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">How We Use Your Information</h2>
				<p>We use information to:</p>
				<div class="space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Provide accurate pollen forecasts for your location</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Improve our app functionality and user experience</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Provide customer support</span>
					</div>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Data Sharing</h2>
				<p>
					We do not sell or trade user information. When you request pollen data, we may share your location coordinates
					with:
				</p>
				<div class="space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Weather data providers to retrieve pollen forecasts</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Legal authorities when required by law</span>
					</div>
				</div>
			</section>

			<section>
				<h2 class="font-semibel mb-3 text-lg">Data Security</h2>
				<p>
					We implement appropriate security measures to protect your information against unauthorized access,
					alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic
					storage is 100% secure.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Data Retention</h2>
				<p>
					We do not permanently store your personal information on our servers. Your app preferences (location, selected
					allergens) are stored locally on your device and can be deleted by uninstalling the app.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Your Rights</h2>
				<p>You have the right to:</p>
				<div class="space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Know what information we process</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Request information about our data practices</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Delete your local app data by uninstalling the app</span>
					</div>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Children's Privacy</h2>
				<p>
					Our service is not intended for children under 13 years of age. We do not knowingly collect personal
					information from children under 13. If you are a parent or guardian and believe your child has provided us
					with personal information, please contact us.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Changes to This Policy</h2>
				<p>
					We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
					policy on this page and updating the "Last updated" date. You are advised to review this policy periodically
					for any changes.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Contact Us</h2>
				<p>
					If you have any questions about this Privacy Policy, please contact us via the form at the bottom of <a
						class="underline"
						href="https://paulplay.studio/legal">this page</a
					>.
				</p>
			</section>
		</div>
	</div>
</div>
