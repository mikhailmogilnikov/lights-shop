import { Hono } from 'hono';
import { logger } from 'hono/logger';

import publicProducts from './modules/products/public';
import internalProducts from './modules/products/internal';

const app = new Hono();

app.use(logger());

app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/_internal/products', internalProducts);
app.route('/products', publicProducts);

export default app;
