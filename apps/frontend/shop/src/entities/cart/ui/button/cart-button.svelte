<script lang="ts">
  import { cartStore } from '~/entities/cart';
  import { openCartSheet } from '~/entities/cart/lib/store/cart-sheet-store.svelte';

  const totalQuantity = $derived($cartStore.reduce((total, item) => total + item.quantity, 0));
</script>

<button class="text-base font-bold uppercase" onclick={openCartSheet}
  >Cart
  {#if totalQuantity > 0}
    ({totalQuantity})
  {/if}
</button>
