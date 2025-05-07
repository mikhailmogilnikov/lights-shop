<script lang="ts">
  import { cartStore } from '~/entities/cart';
  import OrderSummary from './order-summary.svelte';
  import CheckoutForm from './checkout-form.svelte';
  import { MOCK_PRODUCTS } from '~/entities/product/config/mock-products';

  const totalPrice = $derived(
    $cartStore.reduce((acc, item) => {
      const product = MOCK_PRODUCTS.find((product) => product.id === item.id);
      return acc + (product?.price || 0) * item.quantity;
    }, 0),
  );
</script>

<div class="flex flex-col gap-4 max-w-xl mx-auto">
  <OrderSummary {totalPrice} />
  <CheckoutForm />
</div>
