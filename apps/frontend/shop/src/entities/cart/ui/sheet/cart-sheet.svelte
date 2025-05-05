<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import { cartSheetStore, closeCartSheet } from '~/entities/cart/lib/store/cart-sheet-store.svelte';

  const close = () => closeCartSheet();
</script>

{#if $cartSheetStore}
  <div class="fixed inset-0 z-60">
    <button transition:fade aria-label="Close cart" class="absolute inset-0 bg-black/50" onclick={close}></button>
    <div transition:slide={{ axis: 'x' }} class="absolute h-dvh xl:w-1/2 md:w-2/3 w-full right-0 top-0 bg-default-50">
      <h1>Cart</h1>
    </div>
  </div>
{/if}
