import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';

import { internalAuth } from '../../middlewares/internalAuth';

import { orderService } from './services/orderService';
import { updateOrderStatusSchema } from './schemas/order-schemas';

const internalOrders = new Hono();

internalOrders.use('*', internalAuth);

/**
 * Получение списка всех заказов
 */
internalOrders.get('/', async (c) => {
  try {
    const orders = await orderService.getAllOrders();

    return c.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);

    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

/**
 * Получение детальной информации о заказе
 */
internalOrders.get('/:id', async (c) => {
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

/**
 * Обновление статуса заказа
 */
internalOrders.patch('/:id/status', zValidator('json', updateOrderStatusSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = c.req.valid('json');

    const order = await orderService.getOrderById(id);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const updatedOrder = await orderService.updateOrderStatus(id, { status });

    return c.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);

    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

/**
 * Отмена заказа
 */
internalOrders.post('/:id/cancel', async (c) => {
  try {
    const id = c.req.param('id');

    const order = await orderService.getOrderById(id);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    if (order.status === 'CANCELLED') {
      return c.json({ error: 'Order is already cancelled' }, 400);
    }

    if (order.status === 'COMPLETED') {
      return c.json({ error: 'Cannot cancel completed order' }, 400);
    }

    const cancelledOrder = await orderService.cancelOrder(id);

    return c.json(cancelledOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);

    return c.json({ error: 'Failed to cancel order' }, 500);
  }
});

export default internalOrders;
