import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { generateToken } from '../../utils/jwt';
import { adminService } from '../../services/adminService';

const authRoutes = new Hono();

// Схема для логина
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Схема для создания админа
const createAdminSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').optional(),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']).optional(),
});

/**
 * Авторизация админа
 */
authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');

    // Проверяем креды через админ сервис
    const admin = await adminService.verifyPassword(email, password);

    if (!admin) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // Генерируем JWT токен
    const token = await generateToken({
      userId: admin.id,
      email: admin.email,
    });

    return c.json({
      success: true,
      token,
      user: {
        userId: admin.id,
        email: admin.email,
        role: 'admin',
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);

    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * Создание нового администратора (только для SUPER_ADMIN)
 */
authRoutes.post('/create-admin', zValidator('json', createAdminSchema), async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Missing authorization header' }, 401);
    }

    const token = authHeader.substring(7);
    const { verifyToken } = await import('../../utils/jwt');
    const payload = await verifyToken(token);
    
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // Проверяем, что текущий пользователь - админ и имеет права создавать других админов
    const currentAdmin = await adminService.findById(payload.userId);
    
    if (!currentAdmin || currentAdmin.role !== 'SUPER_ADMIN') {
      return c.json({ error: 'Only super admins can create new admins' }, 403);
    }

    const { email, password, name, role } = c.req.valid('json');

    // Проверяем, что админ с таким email не существует
    const existingAdmin = await adminService.findByEmail(email);
    
    if (existingAdmin) {
      return c.json({ error: 'Admin with this email already exists' }, 400);
    }

    // Создаем нового админа
    const newAdmin = await adminService.createAdmin({
      email,
      password, // В реальном проекте нужно хешировать пароль
      name,
      role: role || 'ADMIN',
    });

    return c.json({
      success: true,
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt,
      },
    });
  } catch (error) {
    console.error('Create admin error:', error);

    return c.json({ error: 'Internal server error' }, 500);
  }
});

/**
 * Проверка валидности токена
 */
authRoutes.get('/verify', async (c) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing authorization header' }, 401);
  }

  const token = authHeader.substring(7);
  
  try {
    const { verifyToken } = await import('../../utils/jwt');
    const payload = await verifyToken(token);
    
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    // Проверяем, что админ все еще активен
    const admin = await adminService.findById(payload.userId);
    
    if (!admin || !admin.isActive) {
      return c.json({ error: 'Admin account is inactive' }, 401);
    }

    return c.json({
      valid: true,
      user: {
        userId: admin.id,
        email: admin.email,
        role: 'admin',
        name: admin.name,
        adminRole: admin.role,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);

    return c.json({ error: 'Token verification failed' }, 401);
  }
});

export default authRoutes; 