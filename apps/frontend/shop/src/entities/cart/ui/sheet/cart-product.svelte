<script lang="ts">
  import type { Product } from '~/entities/product';
  import { MOCK_PRODUCTS } from '~/entities/product/config/mock-products';
  import { cartStore } from '../../lib/store/cart-store';
  import NumberFlow from '@number-flow/svelte';
  import { blur, fade, slide } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  const { product }: { product: Product } = $props();

  const getItemTotalPrice = (itemId: string) => {
    const product = MOCK_PRODUCTS.find((product) => product.id === itemId);
    const quantity = $cartStore.find((item) => item.id === itemId)?.quantity || 0;
    return (product?.price || 0) * quantity;
  };

  const quantity = $derived($cartStore.find((item) => item.id === product.id)?.quantity || 0);

  const inc = () => {
    cartStore.updateQuantity(product.id, quantity + 1);
  };

  const dec = () => {
    cartStore.updateQuantity(product.id, quantity - 1);
  };
</script>

<div transition:blur class="flex items-center gap-4">
  <img src={product.imageUrl} alt={product.name} class="size-16 rounded-md object-cover shrink-0" />
  <div class="flex flex-col gap-2 w-full">
    <p class="text-base font-semibold">{product.name}</p>
    <p class="text-sm">
      <NumberFlow format={{ style: 'currency', currency: 'USD' }} value={getItemTotalPrice(product.id)} />
    </p>
  </div>
  <div
    class="flex items-center gap-2 shrink-0 bg-default py-2 border border-default-200 rounded-full w-22 justify-between"
  >
    <button class="text-sm font-bold pb-0.5 px-2" onclick={dec}>-</button>
    <p class="text-sm"><NumberFlow value={quantity} /></p>
    <button class="text-sm font-bold pb-0.5 px-2" onclick={inc}>+</button>
  </div>
</div>
