<script>
	import '../app.css';

	let { children } = $props();
</script>

<main class="min-h-screen fixed inset-0 touch-none overscroll-none select-none p-4">
	{@render children()}
</main>
