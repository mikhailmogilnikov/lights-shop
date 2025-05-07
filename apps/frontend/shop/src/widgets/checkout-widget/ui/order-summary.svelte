<script lang="ts">
  import { goto } from '$app/navigation';
  import { cartStore, openCartSheet } from '~/entities/cart';
  import { formatPrice } from '~/shared/lib/utils/price';

  const { totalPrice }: { totalPrice: number } = $props();

  const totalQuantity = $derived($cartStore.reduce((total, item) => total + item.quantity, 0));
</script>

<div class="flex flex-col gap-4 bg-default-50 p-4 rounded-lg">
  <h1 class="text-lg font-bold">Order Summary</h1>
  <div class="flex gap-2 justify-between">
    <p class="text-base opacity-50">Subtotal:</p>
    <p class="text-base font-bold">{formatPrice(totalPrice)}</p>
  </div>
  <div class="flex gap-2 justify-between">
    <p class="text-base opacity-50">Products in cart:</p>
    <p class="text-base font-bold">{totalQuantity}</p>
  </div>
  <div class="flex gap-4">
    <button class="bg-default px-4 py-2 rounded-md font-bold w-full" onclick={() => goto('/')}>Back to store</button>
    <button class="bg-default px-4 py-2 rounded-md font-bold w-full" onclick={openCartSheet}>Edit cart</button>
  </div>
</div>
