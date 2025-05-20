import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { productClient } from '../../services/productClient';

import { orderService } from './services/orderService';
import { createOrderSchema, customerEmailSchema } from './schemas/order-schemas';

const publicOrders = new Hono();

/**
 * Создание нового заказа
 */
publicOrders.post('/', zValidator('json', createOrderSchema), async (c) => {
  try {
    const orderData = c.req.valid('json');

    // Получаем информацию о всех продуктах и проверяем их наличие
    const productsPromises = orderData.items.map(async (item) => {
      // Получаем детальную информацию о продукте
      const product = await productClient.getProduct(item.productId);

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Проверяем наличие на складе
      const inStock = await productClient.checkStock(item.productId, item.quantity);

      if (!inStock) {
        throw new Error(`Not enough stock for product: ${product.name}`);
      }

      return product;
    });

    try {
      // Ожидаем получения всех данных о продуктах
      const products = await Promise.all(productsPromises);

      // Создаем заказ с полной информацией о продуктах
      const order = await orderService.createOrder(orderData, products);

      // Уменьшаем количество товаров на складе
      for (const item of orderData.items) {
        await productClient.decreaseStock(item.productId, item.quantity);
      }

      return c.json(order, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json(
          {
            error: 'Stock check failed',
            message: error.message,
          },
          400,
        );
      }
      throw error; // Перебрасываем неизвестные ошибки для обработки общим обработчиком
    }
  } catch (error) {
    console.error('Error creating order:', error);

    if (error instanceof Error) {
      return c.json(
        {
          error: 'Failed to create order',
          message: error.message,
        },
        500,
      );
    }

    return c.json({ error: 'Failed to create order' }, 500);
  }
});

/**
 * Получение заказов по email клиента
 */
publicOrders.get('/by-email', zValidator('query', customerEmailSchema), async (c) => {
  try {
    const { email } = c.req.valid('query');
    const orders = await orderService.getOrdersByCustomerEmail(email);

    return c.json(orders);
  } catch (error) {
    console.error('Error fetching orders by email:', error);

    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

/**
 * Получение информации о заказе по ID
 */
publicOrders.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const order = await orderService.getOrderById(id);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    return c.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);

    return c.json({ error: 'Failed to fetch order' }, 500);
  }
});

export default publicOrders;
