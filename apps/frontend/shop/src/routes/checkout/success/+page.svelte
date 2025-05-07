<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div class="flex flex-col items-center justify-center h-[calc(100vh-4rem)] gap-4">
  <h1 class="text-2xl font-bold text-success">Thank you for your order!</h1>
  <p class="text-sm">Check your email for more details.</p>
  <button class="bg-foreground text-background font-bold px-4 py-2 rounded-md mt-4" onclick={() => goto('/')}>
    Back to shop
  </button>
</div>
