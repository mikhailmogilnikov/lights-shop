import type { Context, Next } from 'hono';

import { verifyToken, type JWTPayload } from '../utils/jwt';

declare module 'hono' {
  interface ContextVariableMap {
    user: JWTPayload;
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  const payload = await verifyToken(token);
  
  if (!payload) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }

  // Проверяем, что это админ
  if (payload.role !== 'admin') {
    return c.json({ error: 'Access denied. Admin role required' }, 403);
  }

  // Добавляем пользователя в контекст
  c.set('user', payload);

  await next();
}; 