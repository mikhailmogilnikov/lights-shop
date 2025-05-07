<script lang="ts">
  import { goto } from '$app/navigation';
  import { cubicInOut } from 'svelte/easing';
  import { fade, fly } from 'svelte/transition';
  import { cartStore, cartSheetStore, closeCartSheet } from '~/entities/cart';
  import type { Product } from '~/entities/product';
  import { MOCK_PRODUCTS } from '~/entities/product/config/mock-products';
  import { formatPrice } from '~/shared/lib/utils/price';

  const cartItems = $derived(MOCK_PRODUCTS.filter((product) => $cartStore.some((item) => item.id === product.id)));
  const totalPrice = $derived(
    $cartStore.reduce((acc, item) => {
      const product = MOCK_PRODUCTS.find((product) => product.id === item.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0),
  );

  const close = () => closeCartSheet();

  const getItemTotalPrice = (itemId: string) => {
    const product = MOCK_PRODUCTS.find((product) => product.id === itemId);
    const quantity = $cartStore.find((item) => item.id === itemId)?.quantity || 0;
    return (product?.price || 0) * quantity;
  };

  const handleCheckout = () => {
    close();
    goto('/checkout');
  };
</script>

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
      <div class="flex flex-col gap-4 overflow-y-auto h-full">
        {#each cartItems as item (item.id)}
          <div class="flex items-center gap-4">
            <img src={item.imageUrl} alt={item.name} class="size-16 rounded-md object-cover" />
            <div class="flex flex-col gap-2">
              <p class="text-base font-semibold">{item.name}</p>
              <p class="text-sm">{formatPrice(getItemTotalPrice(item.id))}</p>
            </div>
          </div>
        {/each}
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <p class="text-base font-bold uppercase">Total</p>
          <p class="text-base font-bold">{formatPrice(totalPrice)}</p>
        </div>
        <button
          disabled={cartItems.length === 0}
          class="font-bold text-base py-2 rounded-lg uppercase bg-foreground text-background p-2 disabled:opacity-50 active:scale-97 transition-[scale]"
          onclick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  </div>
{/if}
