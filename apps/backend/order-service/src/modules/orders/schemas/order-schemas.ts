import { z } from 'zod';

/**
 * Схема валидации для элемента заказа (упрощенная для фронтенда)
 */
export const orderItemInputSchema = z.object({
  productId: z.string().uuid({ message: 'Invalid product ID' }),
  quantity: z.number().int().positive({ message: 'Quantity must be positive' }),
});

/**
 * Схема валидации для создания заказа
 */
export const createOrderSchema = z.object({
  customerName: z.string().min(1, { message: 'Customer name is required' }),
  customerLastName: z.string().min(1, { message: 'Customer last name is required' }),
  customerEmail: z.string().email({ message: 'Invalid email address' }),
  customerAddress: z.string().min(1, { message: 'Address is required' }),
  customerCity: z.string().min(1, { message: 'City is required' }),
  customerCountry: z.string().min(1, { message: 'Country is required' }),
  customerZip: z.string().min(1, { message: 'ZIP code is required' }),
  items: z.array(orderItemInputSchema).nonempty({ message: 'Order must contain at least one item' }),
});

/**
 * Схема валидации для обновления статуса заказа
 */
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'], {
    message: 'Invalid order status',
  }),
});

/**
 * Схема для email клиента
 */
export const customerEmailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});
