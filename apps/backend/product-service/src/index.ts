import { Hono } from 'hono';
import { logger } from 'hono/logger';

import publicProducts from './modules/products/public';
import internalProducts from './modules/products/internal';
import { internalAuth } from './middlewares/internalAuth';

const app = new Hono();

app.use(logger());

app.get('/health', (c) => c.json({ status: 'ok' }));

// Применяем middleware для защиты внутренних API
const internalRoutes = new Hono();

internalRoutes.use('*', internalAuth);
internalRoutes.route('/', internalProducts);

app.route('/_internal/products', internalRoutes);
app.route('/products', publicProducts);

export default app;
