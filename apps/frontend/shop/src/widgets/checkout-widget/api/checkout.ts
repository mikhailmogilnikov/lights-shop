import type { CheckoutFormData } from '../model/checkout-schema';

import type { ProductCart } from '~/entities/cart';
import { CONFIG } from '~/shared/config/configuration';

export const createOrder = async (data: CheckoutFormData, cartItems: ProductCart[]) => {
  const transformedData = {
    customerName: data.firstName,
    customerLastName: data.lastName,
    customerEmail: data.email,
    customerAddress: data.address,
    customerCity: data.city,
    customerCountry: data.country,
    customerZip: data.postalCode,
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  };
  const response = await fetch(`${CONFIG.API_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(transformedData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
};
