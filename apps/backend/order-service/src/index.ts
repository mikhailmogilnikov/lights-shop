import { Hono } from 'hono';
import { logger } from 'hono/logger';

import publicOrders from './modules/orders/public';
import internalOrders from './modules/orders/internal';

const app = new Hono();

app.use(logger());

app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/_internal/orders', internalOrders);
app.route('/orders', publicOrders);

export default app;
