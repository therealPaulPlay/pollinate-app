<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import { ArrowLeft } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { vibrate } from "$lib/utils/vibrate";
</script>

<div class="max-h-dvh overflow-y-auto p-4">
	<div class="mx-auto max-w-3xl space-y-6">
		<!-- Back Button -->
		<Button
			onclick={() => {
				vibrate.light();
				goto("/onboarding");
			}}
			class="mb-4"
		>
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back
		</Button>

		<h1 class="mt-4 font-bevellier text-5xl font-bold">Privacy Policy</h1>
		<p class="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

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
				<div class="space-y-3">
					<p>We may collect the following types of information:</p>
					<div class="ml-6 space-y-2">
						<div class="flex items-start gap-2">
							<span class="text-foreground">•</span>
							<span>Location data (when you grant permission) to provide localized pollen forecasts</span>
						</div>
						<div class="flex items-start gap-2">
							<span class="text-foreground">•</span>
							<span>Device information including device type, operating system, and app version</span>
						</div>
						<div class="flex items-start gap-2">
							<span class="text-foreground">•</span>
							<span>Usage data to improve our services</span>
						</div>
						<div class="flex items-start gap-2">
							<span class="text-foreground">•</span>
							<span>Crash reports and diagnostic information</span>
						</div>
					</div>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Analytics</h2>
				<p>
					We use Google Analytics to collect usage statistics and improve our service. Google Analytics may collect
					information such as how often you use the app, the events that occur within the app, aggregated usage,
					performance data, and where you downloaded the app from. We do not link the information we store within Google
					Analytics to any personally identifiable information you submit within the app.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">How We Use Your Information</h2>
				<p>We use the collected information to:</p>
				<div class="ml-6 space-y-2">
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
						<span>Analyze usage patterns and app performance</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Provide customer support</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Send important updates about our service</span>
					</div>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Data Sharing</h2>
				<p>
					We do not sell, trade, or otherwise transfer your personal information to third parties except as described in
					this policy. We may share information with:
				</p>
				<div class="ml-6 space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Service providers who assist in app operation (such as analytics services)</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Legal authorities when required by law</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Business partners in case of merger, acquisition, or asset sale</span>
					</div>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Data Security</h2>
				<p>
					We implement appropriate security measures to protect your information against unauthorized access,
					alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic
					storage is 100% secure.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Data Retention</h2>
				<p>
					We retain your information only as long as necessary to provide our services and fulfill the purposes outlined
					in this policy. You may request deletion of your data by contacting us.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Your Rights</h2>
				<p>Depending on your location, you may have the right to:</p>
				<div class="ml-6 space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Access your personal information</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Correct inaccurate information</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Delete your information</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Restrict processing of your information</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Data portability</span>
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
