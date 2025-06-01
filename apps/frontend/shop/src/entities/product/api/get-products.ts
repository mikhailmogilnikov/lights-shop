import type { Product } from '../model/product.type';

import { CONFIG } from '~/shared/config/configuration';

// Создаем кэш с помощью замыкания
const createProductsCache = () => {
  let cache: Product[] | null = null;
  let lastFetchTime: number | null = null;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 минут в миллисекундах

  return async (): Promise<Product[]> => {
    const now = Date.now();
    
    // Если есть кэш и он не устарел, возвращаем его
    if (cache && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
      return cache;
    }

    // Если кэша нет или он устарел, делаем новый запрос
    const response = await fetch(`${CONFIG.API_URL}/products`);
    const data = await response.json();
    
    // Обновляем кэш
    cache = data;
    lastFetchTime = now;
    
    return data;
  };
};

// Создаем экземпляр кэшированной функции
export const getProducts = createProductsCache();
