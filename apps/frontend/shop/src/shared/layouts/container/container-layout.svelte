<script lang="ts">
  let { children, title }: { children: any; title: string } = $props();
</script>

<div class="container mx-auto px-4 py-8">
  {#if title}
    <h1 class="text-3xl font-bold mb-4">{title}</h1>
  {/if}
  {@render children()}
</div>
