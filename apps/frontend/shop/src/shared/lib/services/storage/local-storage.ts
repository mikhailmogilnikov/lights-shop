import TypedLocalStore from 'typed-local-store';

import type { ProductCart } from '~/entities/cart';

interface LocalStorageSchema {
  cart: ProductCart[];
}

export const LocalStorage = new TypedLocalStore<LocalStorageSchema>({
  storage: 'localStorage',
});
