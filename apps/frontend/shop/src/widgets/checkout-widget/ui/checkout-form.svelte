<script lang="ts">
  import { goto } from '$app/navigation';
  import { z } from 'zod';
  import { cartStore } from '~/entities/cart';
  import FormField from '~/shared/ui/form-field.svelte';
  import { checkoutFormSchema, type CheckoutFormData } from '../model/checkout-schema';
  import { createOrder } from '../api/checkout';

  let formData: CheckoutFormData = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  };

  let cartItems = $cartStore;

  let errors: Partial<Record<keyof CheckoutFormData, string>> = {};

  function validateField(field: keyof CheckoutFormData) {
    try {
      checkoutFormSchema.shape[field].parse(formData[field]);
      errors[field] = undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors[field] = error.errors[0].message;
      }
    }
  }

  async function handleSubmit() {
    try {
      const validatedData = checkoutFormSchema.parse(formData);
      console.log('Form submitted:', validatedData);
      await createOrder(validatedData, cartItems);
      cartStore.clear();
      goto('/checkout/success');
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        errors = error.errors.reduce(
          (acc, curr) => {
            const field = curr.path[0] as keyof CheckoutFormData;
            acc[field] = curr.message;
            return acc;
          },
          {} as Record<keyof CheckoutFormData, string>,
        );
      }
    }
  }
</script>

<div class="flex flex-col gap-4 mt-4">
  <h1 class="text-lg font-bold">Delivery details</h1>
  <form novalidate class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
    <div class="grid grid-cols-2 gap-4">
      <FormField
        label="First Name"
        id="firstName"
        bind:value={formData.firstName}
        error={errors.firstName}
        onBlur={() => validateField('firstName')}
        required
      />
      <FormField
        label="Last Name"
        id="lastName"
        bind:value={formData.lastName}
        error={errors.lastName}
        onBlur={() => validateField('lastName')}
        required
      />
    </div>

    <FormField
      label="Email"
      id="email"
      type="email"
      bind:value={formData.email}
      error={errors.email}
      onBlur={() => validateField('email')}
      required
    />

    <FormField
      label="Address"
      id="address"
      bind:value={formData.address}
      error={errors.address}
      onBlur={() => validateField('address')}
      required
    />

    <div class="grid grid-cols-2 gap-4">
      <FormField
        label="City"
        id="city"
        bind:value={formData.city}
        error={errors.city}
        onBlur={() => validateField('city')}
        required
      />
      <FormField
        label="Postal Code"
        id="postalCode"
        bind:value={formData.postalCode}
        error={errors.postalCode}
        onBlur={() => validateField('postalCode')}
        required
      />
    </div>

    <FormField
      label="Country"
      id="country"
      bind:value={formData.country}
      error={errors.country}
      onBlur={() => validateField('country')}
      required
    />

    <button type="submit" class="px-4 py-2 mt-4 rounded-md font-bold w-full bg-foreground text-background">
      Pay and confirm order
    </button>
  </form>
</div>
