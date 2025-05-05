<script lang="ts">
  import { MOCK_PRODUCTS } from '~/entities/product/config/mock-products';
  import { ProductCard } from '~/entities/product';
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
  {#each MOCK_PRODUCTS as product (product.id)}
    <ProductCard {...product} />
  {/each}
</div>
