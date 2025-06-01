import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { productClient, type CreateProductData, type UpdateProductData } from '../../clients/productClient';
import { orderClient, type OrderStatus } from '../../clients/orderClient';
import { adminService } from '../../services/adminService';

const adminRoutes = new Hono();

// Схемы валидации
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be non-negative integer'),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  price: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  category: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']),
});

const updateAdminSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']).optional(),
  isActive: z.boolean().optional(),
});

// === АДМИНИСТРАТОРЫ ===

/**
 * Получить всех администраторов (только для SUPER_ADMIN)
 */
adminRoutes.get('/admins', async (c) => {
  try {
    const user = c.get('user');
    const currentAdmin = await adminService.findById(user.userId);
    
    if (!currentAdmin || currentAdmin.role !== 'SUPER_ADMIN') {
      return c.json({ error: 'Only super admins can view all admins' }, 403);
    }

    const admins = await adminService.getAllAdmins();
    
    return c.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);

    return c.json({ error: 'Failed to fetch admins' }, 500);
  }
});

/**
 * Получить админа по ID
 */
adminRoutes.get('/admins/:id', async (c) => {
  try {
    const user = c.get('user');
    const adminId = c.req.param('id');
    
    // Админы могут смотреть только свой профиль, кроме SUPER_ADMIN
    if (user.userId !== adminId) {
      const currentAdmin = await adminService.findById(user.userId);

      if (!currentAdmin || currentAdmin.role !== 'SUPER_ADMIN') {
        return c.json({ error: 'Access denied' }, 403);
      }
    }

    const admin = await adminService.findById(adminId);
    
    if (!admin) {
      return c.json({ error: 'Admin not found' }, 404);
    }
    
    return c.json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);

    return c.json({ error: 'Failed to fetch admin' }, 500);
  }
});

/**
 * Обновить администратора
 */
adminRoutes.put('/admins/:id', zValidator('json', updateAdminSchema), async (c) => {
  try {
    const user = c.get('user');
    const adminId = c.req.param('id');
    const data = c.req.valid('json');
    
    // Админы могут обновлять только свой профиль, кроме SUPER_ADMIN
    if (user.userId !== adminId) {
      const currentAdmin = await adminService.findById(user.userId);

      if (!currentAdmin || currentAdmin.role !== 'SUPER_ADMIN') {
        return c.json({ error: 'Access denied' }, 403);
      }
    }

    // Обычные админы не могут изменять роль
    if (data.role && user.userId === adminId) {
      const currentAdmin = await adminService.findById(user.userId);

      if (!currentAdmin || currentAdmin.role !== 'SUPER_ADMIN') {
        delete data.role;
      }
    }

    const updatedAdmin = await adminService.updateAdmin(adminId, data);
    
    if (!updatedAdmin) {
      return c.json({ error: 'Admin not found' }, 404);
    }
    
    return c.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin:', error);

    return c.json({ error: 'Failed to update admin' }, 500);
  }
});

/**
 * Удалить администратора (только для SUPER_ADMIN)
 */
adminRoutes.delete('/admins/:id', async (c) => {
  try {
    const user = c.get('user');
    const adminId = c.req.param('id');
    
    const currentAdmin = await adminService.findById(user.userId);
    
    if (!currentAdmin || currentAdmin.role !== 'SUPER_ADMIN') {
      return c.json({ error: 'Only super admins can delete admins' }, 403);
    }

    // Нельзя удалить самого себя
    if (user.userId === adminId) {
      return c.json({ error: 'Cannot delete yourself' }, 400);
    }

    const success = await adminService.deleteAdmin(adminId);
    
    if (!success) {
      return c.json({ error: 'Admin not found' }, 404);
    }
    
    return c.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);

    return c.json({ error: 'Failed to delete admin' }, 500);
  }
});

// === ПРОДУКТЫ ===

/**
 * Получить все продукты
 */
adminRoutes.get('/products', async (c) => {
  try {
    const products = await productClient.getAllProducts();
    
    return c.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);

    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

/**
 * Получить продукт по ID
 */
adminRoutes.get('/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await productClient.getProductById(id);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);

    return c.json({ error: 'Failed to fetch product' }, 500);
  }
});

/**
 * Создать новый продукт
 */
adminRoutes.post('/products', zValidator('json', createProductSchema), async (c) => {
  try {
    const data = c.req.valid('json') as CreateProductData;
    const product = await productClient.createProduct(data);
    
    return c.json(product, 201);
  } catch (error) {
    console.error('Error creating product:', error);

    return c.json({ error: 'Failed to create product' }, 500);
  }
});

/**
 * Обновить продукт
 */
adminRoutes.put('/products/:id', zValidator('json', updateProductSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const data = c.req.valid('json') as UpdateProductData;
    
    const product = await productClient.updateProduct(id, data);
    
    return c.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error instanceof Error && error.message.includes('404')) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

/**
 * Удалить продукт
 */
adminRoutes.delete('/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const result = await productClient.deleteProduct(id);
    
    return c.json(result);
  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (error instanceof Error && error.message.includes('404')) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

/**
 * Проверить наличие товара на складе
 */
adminRoutes.get('/products/:id/stock/:quantity', async (c) => {
  try {
    const id = c.req.param('id');
    const quantity = Number(c.req.param('quantity'));
    
    if (isNaN(quantity) || quantity < 0) {
      return c.json({ error: 'Invalid quantity' }, 400);
    }
    
    const result = await productClient.checkStock(id, quantity);
    
    return c.json(result);
  } catch (error) {
    console.error('Error checking stock:', error);

    return c.json({ error: 'Failed to check stock' }, 500);
  }
});

/**
 * Уменьшить количество товара на складе
 */
adminRoutes.post('/products/:id/decrease-stock', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const quantity = Number(body.quantity);
    
    if (isNaN(quantity) || quantity < 1) {
      return c.json({ error: 'Invalid quantity' }, 400);
    }
    
    const result = await productClient.decreaseStock(id, quantity);
    
    return c.json(result);
  } catch (error) {
    console.error('Error decreasing stock:', error);

    return c.json({ error: 'Failed to decrease stock' }, 500);
  }
});

// === ЗАКАЗЫ ===

/**
 * Получить все заказы
 */
adminRoutes.get('/orders', async (c) => {
  try {
    const orders = await orderClient.getAllOrders();
    
    return c.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);

    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

/**
 * Получить заказ по ID
 */
adminRoutes.get('/orders/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const order = await orderClient.getOrderById(id);
    
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
 * Обновить статус заказа
 */
adminRoutes.patch('/orders/:id/status', zValidator('json', updateOrderStatusSchema), async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = c.req.valid('json');
    
    const order = await orderClient.updateOrderStatus(id, { status: status as OrderStatus });
    
    return c.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    
    if (error instanceof Error && error.message.includes('404')) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

/**
 * Отменить заказ
 */
adminRoutes.post('/orders/:id/cancel', async (c) => {
  try {
    const id = c.req.param('id');
    
    const order = await orderClient.cancelOrder(id);
    
    return c.json(order);
  } catch (error) {
    console.error('Error canceling order:', error);
    
    if (error instanceof Error && error.message.includes('404')) {
      return c.json({ error: 'Order not found' }, 404);
    }
    
    return c.json({ error: 'Failed to cancel order' }, 500);
  }
});

// === ДАШБОРД ===

/**
 * Получить статистику для дашборда
 */
adminRoutes.get('/dashboard', async (c) => {
  try {
    const orders = await orderClient.getAllOrders();
    
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      processingOrders: orders.filter(o => o.status === 'PROCESSING').length,
      completedOrders: orders.filter(o => o.status === 'COMPLETED').length,
      cancelledOrders: orders.filter(o => o.status === 'CANCELLED').length,
      totalRevenue: orders
        .filter(o => o.status === 'COMPLETED')
        .reduce((sum, order) => sum + order.totalAmount, 0),
      recentOrders: orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    };
    
    return c.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    return c.json({ error: 'Failed to fetch dashboard data' }, 500);
  }
});

export default adminRoutes; 