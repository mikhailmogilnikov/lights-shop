<script lang="ts">
  import { getProducts, ProductCard } from '~/entities/product';

  const productsPromise = getProducts();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
  {#await productsPromise}
    <div class="flex items-center justify-center h-full">
      <div class="animate-spin rounded-full size-6 border-t-2 border-b-2 border-foreground"></div>
    </div>
  {:then products}
    {#each products as product (product.id)}
      <ProductCard {...product} />
    {/each}
  {:catch error}
    <div class="flex items-center justify-center h-full">
      <p class="text-sm text-foreground/50">Error: {error.message}</p>
    </div>
  {/await}
</div>
