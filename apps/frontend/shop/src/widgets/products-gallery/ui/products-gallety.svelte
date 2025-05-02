<script lang="ts">
  import { ProductCard } from '../../../entities/product';

  const products = Array.from({ length: 20 }, (_, index) => index);
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
  {#each products as product}
    <ProductCard />
  {/each}
</div>
