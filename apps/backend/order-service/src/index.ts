import { Hono } from 'hono';
import { logger } from 'hono/logger';

import publicOrders from './modules/orders/public';
import internalOrders from './modules/orders/internal';
import { internalAuth } from './middlewares/internalAuth';

const app = new Hono();

app.use(logger());

app.get('/health', (c) => c.json({ status: 'ok' }));

// Применяем middleware для защиты внутренних API
const internalRoutes = new Hono();

internalRoutes.use('*', internalAuth);
internalRoutes.route('/', internalOrders);

app.route('/_internal/orders', internalRoutes);
app.route('/orders', publicOrders);

export default app;
