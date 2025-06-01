<script lang="ts">
  import { getProducts } from '~/entities/product';
  import CheckoutContent from './checkout-content.svelte';

  const productsPromise = getProducts();
</script>

<div class="flex flex-col gap-4 max-w-xl mx-auto">
  {#await productsPromise}
    <div class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full size-6 border-t-2 border-b-2 border-foreground"></div>
    </div>
  {:then products}
    <CheckoutContent {products} />
  {/await}
</div>
