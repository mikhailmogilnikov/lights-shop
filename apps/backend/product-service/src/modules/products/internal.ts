import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { internalAuth } from '~/middlewares/internalAuth';

import { productService } from './services/productService';
import { createProductSchema, updateProductSchema } from './schemas/product-schemas';

const internalProducts = new Hono();

internalProducts.use('*', internalAuth);

/**
 * Создать новый продукт
 */
internalProducts.post('/', zValidator('json', createProductSchema), async (c) => {
  try {
    const data = c.req.valid('json');
    const newProduct = await productService.createProduct(data);

    return c.json(newProduct, 201);
  } catch (error) {
    console.error('Error creating product:', error);

    return c.json({ error: 'Failed to create product' }, 500);
  }
});

/**
 * Обновить продукт
 */
internalProducts.put('/:id', zValidator('json', updateProductSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json');

    const existingProduct = await productService.getProductById(id);

    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const updatedProduct = await productService.updateProduct(id, data);

    return c.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);

    return c.json({ error: 'Failed to update product' }, 500);
  }
});

/**
 * Удалить продукт
 */
internalProducts.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const existingProduct = await productService.getProductById(id);

    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }

    await productService.deleteProduct(id);

    return c.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);

    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

/**
 * Проверить наличие продукта на складе
 */
internalProducts.get('/:id/stock/:quantity', async (c) => {
  try {
    const id = c.req.param('id');
    const quantity = Number(c.req.param('quantity'));

    if (isNaN(quantity) || quantity < 0) {
      return c.json({ error: 'Invalid quantity' }, 400);
    }

    const inStock = await productService.checkStock(id, quantity);

    return c.json({ inStock });
  } catch (error) {
    console.error('Error checking stock:', error);

    return c.json({ error: 'Failed to check stock' }, 500);
  }
});

/**
 * Уменьшить количество товара на складе
 */
internalProducts.post('/:id/decrease-stock', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const quantity = Number(body.quantity);

    if (isNaN(quantity) || quantity < 1) {
      return c.json({ error: 'Invalid quantity' }, 400);
    }

    const result = await productService.decreaseStock(id, quantity);

    if (!result) {
      return c.json({ error: 'Not enough stock or product not found' }, 400);
    }

    return c.json({ success: true, newStockQuantity: result.stockQuantity });
  } catch (error) {
    console.error('Error decreasing stock:', error);

    return c.json({ error: 'Failed to decrease stock' }, 500);
  }
});

export default internalProducts;
