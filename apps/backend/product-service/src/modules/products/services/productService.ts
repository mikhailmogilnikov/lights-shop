import type { Product } from '~prisma/generated/client';

import { prisma } from '~prisma/client';

export interface CreateProductInput {
  name: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  imageUrl?: string;
  stockQuantity?: number;
}

export const productService = {
  /**
   * Получить все продукты
   */
  async getAllProducts(): Promise<Product[]> {
    return prisma.product.findMany();
  },

  /**
   * Получить продукт по ID
   */
  async getProductById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  /**
   * Создать новый продукт
   */
  async createProduct(data: CreateProductInput): Promise<Product> {
    return prisma.product.create({
      data,
    });
  },

  /**
   * Обновить продукт
   */
  async updateProduct(id: string, data: UpdateProductInput): Promise<Product | null> {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  /**
   * Удалить продукт
   */
  async deleteProduct(id: string): Promise<Product | null> {
    return prisma.product.delete({
      where: { id },
    });
  },

  /**
   * Проверить наличие продукта на складе
   */
  async checkStock(id: string, quantity: number): Promise<boolean> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { stockQuantity: true },
    });

    return product !== null && product.stockQuantity >= quantity;
  },

  /**
   * Уменьшить количество товара на складе
   */
  async decreaseStock(id: string, quantity: number): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { stockQuantity: true },
    });

    if (!product || product.stockQuantity < quantity) {
      return null;
    }

    return prisma.product.update({
      where: { id },
      data: {
        stockQuantity: product.stockQuantity - quantity,
      },
    });
  },
};
