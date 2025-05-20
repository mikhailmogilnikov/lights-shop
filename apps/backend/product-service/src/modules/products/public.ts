import { Hono } from 'hono';

import { productService } from './services/productService';

const publicProducts = new Hono();

/**
 * Получить список всех продуктов
 */
publicProducts.get('/', async (c) => {
  try {
    const products = await productService.getAllProducts();

    return c.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);

    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

/**
 * Получить продукт по ID
 */
publicProducts.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await productService.getProductById(id);

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);

    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

export default publicProducts;
