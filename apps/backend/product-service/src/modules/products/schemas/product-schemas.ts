import { z } from 'zod';

/**
 * Схема валидации для создания продукта
 */
export const createProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.number().min(0, { message: 'Price must be non-negative' }),
  imageUrl: z.string().url({ message: 'Image URL must be a valid URL' }),
  stockQuantity: z.number().int().min(0, { message: 'Stock quantity must be non-negative' }),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

/**
 * Схема валидации для обновления продукта
 */
export const updateProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).optional(),
  price: z.number().min(0, { message: 'Price must be non-negative' }).optional(),
  imageUrl: z.string().url({ message: 'Image URL must be a valid URL' }).optional(),
  stockQuantity: z.number().int().min(0, { message: 'Stock quantity must be non-negative' }).optional(),
});

export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
