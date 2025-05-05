<script lang="ts">
  import NumberFlow from '@number-flow/svelte';
  import { fade } from 'svelte/transition';

  import { cartStore } from '~/entities/cart';
  import type { Product } from '~/entities/product';

  const { id, name, price, imageUrl }: Product = $props();

  const quantity = $derived($cartStore.find((item) => item.id === id)?.quantity || 0);

  const addToCart = () => cartStore.addItem(id, 1);

  const inc = () => cartStore.updateQuantity(id, quantity + 1);

  const dec = () => {
    if (quantity > 0) {
      cartStore.updateQuantity(id, quantity - 1);
    }
  };
</script>

<div class="rounded-lg bg-default shadow-lg overflow-hidden">
  <div class="bg-default-200 w-full h-48 overflow-hidden">
    <img src={imageUrl} alt={name} class="w-full h-full object-cover" />
  </div>
  <div class="p-4 flex flex-col gap-4">
    <p class="text-base font-medium">{name}</p>
    <p class="text-lg font-semibold text-muted-foreground">{price}$</p>
    {#if quantity === 0}
      <button in:fade class="font-bold px-4 py-2 bg-foreground/10 text-white rounded-lg h-10" onclick={addToCart}
        >Add to cart</button
      >
    {:else}
      <div
        in:fade
        class="flex items-center justify-between gap-2 text-xl bg-foreground/10 rounded-lg h-10 overflow-clip"
      >
        <button
          class="font-bold h-full px-4 pr-10 pb-0.5 bg-gradient-to-r hover:from-foreground/20 active:from-foreground/30 to-transparent transition-colors cursor-pointer"
          onclick={dec}>-</button
        >
        <p class="text-base font-semibold">
          <NumberFlow value={quantity} />
        </p>
        <button
          class="font-bold h-full px-4 pb-0.5 pl-10 bg-gradient-to-l hover:from-foreground/20 active:from-foreground/30 to-transparent transition-colors cursor-pointer"
          onclick={inc}>+</button
        >
      </div>
    {/if}
  </div>
</div>
