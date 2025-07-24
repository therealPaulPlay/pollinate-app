<script>
	import Button from "$lib/components/ui/button/button.svelte";
	import { vibrate } from "$lib/utils/vibrate";
	import { ArrowRight } from "lucide-svelte";
</script>

<div class="flex h-full flex-col items-center">
	<div class="mt-16 space-y-2 text-center">
        <img alt="logo" src="/images/logo_500x500.png" class="w-32 h-32 mx-auto" />
		<h1 class="font-bevellier text-7xl">Pollinate</h1>
		<p>No-nonsense pollen forecast.</p>
	</div>
	<div class="mt-auto mb-8 max-w-md space-y-6 text-center">
		<p class="text-sm max-w-4/5 mx-auto">
			By clicking on <i>Get started</i>, you agree to our <a href="/privacy" class="font-semibold hover:underline"
				>privacy policy</a
			>
			and our <a href="/tems" class="font-semibold hover:underline">terms of use</a>.
		</p>
		<Button
			size="lg"
			onclick={() => {
				vibrate.light();
			}}>Get started <ArrowRight /></Button
		>
	</div>
</div>
