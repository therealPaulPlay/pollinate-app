<script>
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";
	import { vibrate } from "$lib/utils/vibrate";
	import { ArrowRight } from "lucide-svelte";
	import { onMount } from "svelte";
	import * as m from "$lib/paraglide/messages";

	let canvas;
	let ctx;
	let particles = [];
	let animationId;

	class PollenParticle {
		constructor() {
			this.reset();
			this.x = Math.random() * (canvas.width + 200) - 200; // Start some off-screen
			this.age = Math.random() * this.maxAge;
		}

		reset() {
			this.x = -10;
			this.y = Math.random() * canvas.height;
			this.vx = 1 + Math.random() * 3; // Horizontal velocity
			this.vy = (Math.random() - 0.5) * 0.5; // Slight vertical drift
			this.size = 1 + Math.random() * 5;
			this.opacity = 0.025 + Math.random() * 0.075;
			this.age = 0;
			this.maxAge = 800 + Math.random() * 200;
			this.windOffset = Math.random() * Math.PI * 2;
		}

		update(deltaTime = 1) {
			this.age += deltaTime;

			// Wind effect - subtle sine wave movement
			const windStrength = 0.5;
			const windSpeed = 0.02;
			this.vy += Math.sin(this.age * windSpeed + this.windOffset) * windStrength * 0.01 * deltaTime;

			// Update position
			this.x += this.vx * deltaTime;
			this.y += this.vy * deltaTime;

			// Reset if particle goes off screen or gets too old
			if (this.x > canvas.width + 50 || this.age > this.maxAge) this.reset();

			// Keep within vertical bounds with soft bouncing
			if (this.y < 0 || this.y > canvas.height) this.vy *= -0.5;
		}

		draw() {
			ctx.save();
			ctx.globalAlpha = this.opacity;
			ctx.fillStyle = "#8B4513"; // Dark orange-brown
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
			ctx.restore();
		}
	}

	function resizeCanvas() {
		if (!canvas) return;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	let lastTime = 0;

	function animate(currentTime = 0) {
		if (!ctx || !canvas) return;

		const deltaTime = currentTime - lastTime;
		const normalizedDelta = deltaTime / 16.67; // Normalize to 60fps (16.67ms per frame)
		lastTime = currentTime;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		particles.forEach((particle) => {
			particle.update(normalizedDelta); // Pass delta to update
			particle.draw();
		});

		animationId = requestAnimationFrame(animate); // Endless loop
	}

	onMount(() => {
		localStorage.removeItem("onboardingCompleted");
		if (!canvas) return;

		ctx = canvas.getContext("2d");
		resizeCanvas();

		// Create 75 particles
		for (let i = 0; i < 75; i++) {
			particles.push(new PollenParticle());
		}

		animate();
	});
</script>

<svelte:window onresize={resizeCanvas} />

<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 z-0"></canvas>

<div class="relative z-10 flex h-full flex-col items-center">
	<div class="mt-[calc(55dvh-225px)] space-y-2 text-center">
		<img alt="logo" src="/images/logo_500x500.png" class="mx-auto h-30 w-30" />
		<h1 class="font-bevellier text-7xl">Pollinate</h1>
		<p class="-mt-1.5">Accurate pollen forecasts. Free.</p>
	</div>
	<div class="mt-auto mb-8 max-w-md space-y-6 text-center">
		<p class="mx-auto max-w-4/5 text-sm opacity-75">
			{m.onboarding_legal_prefix()}
			<i>{m.onboarding_get_started()}</i>{m.onboarding_legal_middle()}
			<a href="/privacy" class="font-semibold hover:underline">{m.onboarding_privacy_policy()}</a>
			{m.onboarding_legal_and()}
			<a href="/terms" class="font-semibold hover:underline">{m.onboarding_terms_of_use()}</a
			>{m.onboarding_legal_suffix()}
		</p>
		<Button
			size="lg"
			onclick={() => {
				vibrate.light();
				goto("/select-pollen-types");
			}}>{m.onboarding_get_started()} <ArrowRight /></Button
		>
	</div>
</div>
