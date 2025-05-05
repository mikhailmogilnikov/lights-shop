import { get, writable } from 'svelte/store';

import { LocalStorage } from '~/shared/lib/services/storage';
import type { ProductCart } from '~/entities/cart';

const storedCart: ProductCart[] = LocalStorage.getItem('cart', 'safe') || [];

function createCartStore() {
  const { subscribe, set, update } = writable<ProductCart[]>(storedCart);

  const store = {
    subscribe,

    // Добавление товара в корзину
    addItem: (id: string, quantity = 1) => {
      update((items) => {
        const existingItem = items.find((i) => i.id === id);

        if (existingItem) {
          // Если товар уже есть, увеличиваем количество
          return items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i));
        }

        // Если товара нет, добавляем новый
        return [...items, { id, quantity }];
      });
    },

    // Удаление товара из корзины
    removeItem: (id: string) => {
      update((items) => items.filter((i) => i.id !== id));
    },

    // Изменение количества товара
    updateQuantity: (id: string, quantity: number) => {
      if (quantity <= 0) {
        // Если количество меньше или равно 0, удаляем товар
        return store.removeItem(id);
      }

      update((items) => items.map((i) => (i.id === id ? { ...i, quantity } : i)));
    },

    // Очистка корзины
    clear: () => {
      set([]);
    },

    // Проверка наличия товара в корзине
    hasItem: (id: string) => {
      const items = get({ subscribe });

      return items.some((i) => i.id === id);
    },

    // Получение количества конкретного товара
    getItemQuantity: (id: string) => {
      const items = get({ subscribe });
      const item = items.find((i) => i.id === id);

      return item ? item.quantity : 0;
    },

    // Подсчет общего количества товаров
    getTotalQuantity: () => {
      const items = get({ subscribe });

      return items.reduce((total, item) => total + item.quantity, 0);
    },
  };

  return store;
}

export const cartStore = createCartStore();

cartStore.subscribe((value) => {
  LocalStorage.setItem('cart', value);
});
