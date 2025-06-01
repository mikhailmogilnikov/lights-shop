<script lang="ts">
  import { cubicInOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import { cartSheetStore, closeCartSheet } from '~/entities/cart';

  import CartContent from './cart-content.svelte';
  import { getProducts } from '~/entities/product';

  const productsPromise = getProducts();

  const close = () => closeCartSheet();
</script>

{#await productsPromise}
  <div></div>
{:then products}
  {#if $cartSheetStore}
    <div class="fixed inset-0 z-60">
      <button transition:fade aria-label="Close cart" class="absolute inset-0 bg-black/50" onclick={close}></button>
      <div
        transition:fly={{ x: '100%', easing: cubicInOut }}
        class="absolute h-dvh xl:w-1/2 md:w-2/3 w-full right-0 top-0 bg-default-50 p-4 xl:p-6 flex flex-col gap-4 xl:gap-6"
      >
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold uppercase">Cart</h1>
          <button aria-label="Close cart" class="text-4xl font-bold rotate-45" onclick={close}> + </button>
        </div>
        <CartContent {products} />
      </div>
    </div>
  {/if}
{/await}
