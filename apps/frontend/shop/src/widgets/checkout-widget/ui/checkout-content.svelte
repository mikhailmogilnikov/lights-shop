<script lang="ts">
  import OrderSummary from './order-summary.svelte';
  import CheckoutForm from './checkout-form.svelte';
  import { cartStore } from '~/entities/cart';
  import type { Product } from '~/entities/product';

  const { products }: { products: Product[] } = $props();

  const totalPrice = $derived(
    $cartStore.reduce((acc, item) => {
      const product = products.find((product) => product.id === item.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0),
  );
</script>

<OrderSummary {totalPrice} />
<CheckoutForm />
