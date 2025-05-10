import { Hono } from 'hono';

const publicOrders = new Hono();

publicOrders.post('/', (c) => c.text('new order'));

export default publicOrders;
