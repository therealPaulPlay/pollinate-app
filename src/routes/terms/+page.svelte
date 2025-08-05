<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import { ArrowLeft } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { vibrate } from "$lib/utils/vibrate";

	function goBack() {
		vibrate.light();
		const onboardingComplete = localStorage.getItem("onboardingCompleted");

		if (onboardingComplete)
			goto("/"); // Go to main app
		else goto("/onboarding"); // Go to onboarding
	}
</script>

<header
	class="fixed top-0 z-10 flex w-full items-center gap-4 bg-background p-4 pt-[calc(1.5rem+var(--safe-top))] pb-3"
>
	<!-- Back Button -->
	<Button onclick={goBack} class="mb-1.5 px-4!">
		<ArrowLeft class="h-4 w-4" />
	</Button>
	<h1 class="truncate pb-1.5 font-bevellier text-5xl">Terms of Use</h1>
</header>

<div
	class="of-top of-length-2 fixed top-[calc(5.5rem+var(--safe-top))] right-0 bottom-0 left-0 space-y-6 overflow-y-auto px-4 pt-4 pb-10"
>
	<div class="mx-auto max-w-3xl space-y-6">
		<p class="text-muted-foreground">Last updated: July 31, 2025</p>

		<div class="space-y-6">
			<section>
				<h2 class="mb-3 text-lg font-semibold">Agreement to Terms</h2>
				<p>
					By accessing and using Pollinate ("Service") provided by Paul Rhomberg ("we," "us," or "our"), you agree to be
					bound by these Terms of Use. If you do not agree to these terms, please do not use our service.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Description of Service</h2>
				<p>
					Pollinate is a mobile application that provides pollen forecast information and related services. The service
					is provided for informational purposes only.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Data Accuracy Disclaimer</h2>
				<div class="space-y-2">
					<p>
						We do not guarantee the accuracy, completeness, or reliability of any pollen data, forecasts, or health
						recommendations provided through our service.
					</p>
					<p>
						Pollen levels and forecasts are estimates based on available data sources and may not reflect actual
						conditions. Users should consult healthcare professionals for medical advice and not rely solely on our app
						for health-related decisions.
					</p>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Prohibited Uses</h2>
				<p>You agree not to:</p>
				<div class="mt-1 space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Extract, scrape, or systematically collect data from our service</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Use the service for any commercial purpose without our written consent</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Reverse engineer, decompile, or disassemble the application</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Violate any applicable laws or regulations</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Interfere with or disrupt the service or servers</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Use the service to harm, harass, or violate the rights of others</span>
					</div>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Intellectual Property</h2>
				<p>
					The service and its original content, features, and functionality are and will remain the exclusive property
					of Paul Rhomberg and its licensors. The service is protected by copyright, trademark, and other laws.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Payments and Purchases</h2>
				<p>
					If you purchase premium features through app stores (Google Play Store, Apple App Store), the following terms
					apply:
				</p>
				<div class="mt-1 space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>All purchases are processed by the respective app store, not by us directly</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>We are not responsible for any payment processing issues, billing disputes, or refund requests</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Refund policies are governed by the app store's terms and conditions</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>We do not store or have access to your payment information</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Premium features are provided "as-is" without warranty of continuous availability</span>
					</div>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Service Availability</h2>
				<p>
					We do not guarantee that our service will be available at all times or function without interruption. The
					service may experience:
				</p>
				<div class="mt-1 space-y-2">
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Temporary outages or maintenance periods</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Server downtime or technical difficulties</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Incompatibility with certain devices or operating systems</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Bugs, errors, or malfunctions</span>
					</div>
					<div class="flex items-start gap-2">
						<span class="text-foreground">•</span>
						<span>Changes or discontinuation of features</span>
					</div>
				</div>
				<p class="mt-1">
					We reserve the right to modify, suspend, or discontinue the service at any time without notice.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Limitation of Liability</h2>
				<div class="mt-2 space-y-2">
					<p>
						To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special,
						consequential, or punitive damages, including but not limited to loss of profits, data, use, or other
						intangible losses resulting from your use of the service.
					</p>
					<p>
						This includes damages arising from app malfunctions, service interruptions, inaccurate data, or any other
						service-related issues.
					</p>
				</div>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Indemnification</h2>
				<p>
					You agree to defend, indemnify, and hold harmless Paul Rhomberg from and against any and all claims, damages,
					obligations, losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from your
					use of the service or violation of these terms.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Device Compatibility</h2>
				<p>
					We do not guarantee compatibility with all devices, operating systems, or software configurations. The service
					may not function properly on older devices or operating system versions. We are not responsible for any issues
					arising from device incompatibility.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Termination</h2>
				<p>
					We may terminate or suspend your access to the service immediately, without prior notice or liability, for any
					reason, including without limitation if you breach these terms.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Governing Law</h2>
				<p>
					These terms shall be governed and construed in accordance with the laws of Austria, without regard to its
					conflict of law provisions. Any disputes arising from these terms or the use of our service shall be subject
					to the exclusive jurisdiction of the courts of Austria.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Changes to Terms</h2>
				<p>
					We reserve the right to modify or replace these terms at any time. Your continued use of the service after any
					changes constitutes acceptance of the new terms.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Contact Information</h2>
				<p>
					If you have any questions about these Terms of Use, please contact us via the form at the bottom of <a
						class="underline"
						href="https://paulplay.studio/legal">this page</a
					>.
				</p>
			</section>

			<section>
				<h2 class="mb-3 text-lg font-semibold">Severability</h2>
				<p>
					If any provision of these terms is held to be invalid or unenforceable, the remaining provisions will remain
					in full force and effect.
				</p>
			</section>
		</div>
	</div>
</div>
