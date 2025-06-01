<script lang="ts">
  import { cartStore, closeCartSheet } from '~/entities/cart';
  import CartProduct from './cart-product.svelte';
  import NumberFlow from '@number-flow/svelte';
  import { goto } from '$app/navigation';
  import type { Product } from '~/entities/product';

  const { products }: { products: Product[] } = $props();

  const cartItems = $derived(products.filter((product) => $cartStore.some((item) => item.id === product.id)));

  const totalPrice = $derived(
    $cartStore.reduce((acc, item) => {
      const product = products.find((product) => product.id === item.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0),
  );

  const handleCheckout = () => {
    closeCartSheet();
    goto('/checkout');
  };
</script>

<div class="flex flex-col gap-4 overflow-y-auto h-full">
  {#each cartItems as item (item.id)}
    <CartProduct {products} product={item} />
  {/each}
</div>
<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <p class="text-base font-bold uppercase">Total</p>
    <p class="text-base font-bold">
      <NumberFlow format={{ style: 'currency', currency: 'USD' }} value={totalPrice} />
    </p>
  </div>
  <button
    disabled={cartItems.length === 0}
    class="font-bold text-base py-2 rounded-lg uppercase bg-foreground text-background p-2 disabled:opacity-50 active:scale-97 transition-[scale]"
    onclick={handleCheckout}
  >
    Checkout
  </button>
</div>
