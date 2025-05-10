import { Hono } from 'hono';

const internalOrders = new Hono();

internalOrders.get('/', (c) => c.text('orders list'));

internalOrders.get('/:id', (c) => c.text('order details'));

internalOrders.patch('/:id/status', (c) => c.text('update order status'));

export default internalOrders;
