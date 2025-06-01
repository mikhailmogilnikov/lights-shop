import { Hono } from 'hono';
import { logger } from 'hono/logger';

import authRoutes from './modules/auth/auth';
import adminRoutes from './modules/admin/admin';
import { authMiddleware } from './middlewares/auth';

const app = new Hono();

app.use(logger());

app.get('/health', (c) => c.json({ status: 'ok' }));

// Публичные роуты для аутентификации
app.route('/auth', authRoutes);

// Защищенные роуты админ панели (теперь на корне)
app.use('/products/*', authMiddleware);
app.use('/orders/*', authMiddleware);
app.use('/admins/*', authMiddleware);
app.use('/dashboard', authMiddleware);
app.route('/', adminRoutes);

const port = process.env.PORT || 3003;

console.log(`Admin Panel Service running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
}; 