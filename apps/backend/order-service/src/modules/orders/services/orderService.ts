import type { Order, OrderItem, OrderStatus } from '~prisma/generated/client';

import type { Product } from '~/services/productClient';

import { prisma } from '~prisma/client';

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerLastName: string;
  customerEmail: string;
  customerAddress: string;
  customerCity: string;
  customerCountry: string;
  customerZip: string;
  items: OrderItemInput[];
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
}

export const orderService = {
  /**
   * Получить список всех заказов
   */
  async getAllOrders(): Promise<OrderWithItems[]> {
    return prisma.order.findMany({
      include: {
        items: true,
      },
    });
  },

  /**
   * Получить заказ по ID
   */
  async getOrderById(id: string): Promise<OrderWithItems | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  },

  /**
   * Создать новый заказ
   */
  async createOrder(data: CreateOrderInput, products: Product[]): Promise<OrderWithItems> {
    const { items, ...orderData } = data;

    // Вычисляем общую сумму заказа на основе полученных данных о продуктах
    let totalAmount = 0;

    // Преобразуем входные данные в полный набор информации о элементах заказа
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Product info not found for product ID: ${item.productId}`);
      }

      const itemTotalPrice = product.price * item.quantity;

      totalAmount += itemTotalPrice;

      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        pricePerUnit: product.price,
        totalPrice: itemTotalPrice,
      };
    });

    // Создаем заказ в транзакции для обеспечения консистентности данных
    return prisma.$transaction(async (tx) => {
      // Создаем основную запись заказа
      const order = await tx.order.create({
        data: {
          ...orderData,
          totalAmount,
        },
      });

      // Создаем записи для элементов заказа
      const orderItems = await Promise.all(
        orderItemsData.map((item) =>
          tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              pricePerUnit: item.pricePerUnit,
              totalPrice: item.totalPrice,
            },
          }),
        ),
      );

      // Возвращаем заказ с его элементами
      return {
        ...order,
        items: orderItems,
      };
    });
  },

  /**
   * Обновить статус заказа
   */
  async updateOrderStatus(id: string, { status }: UpdateOrderStatusInput): Promise<OrderWithItems | null> {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });

    return order;
  },

  /**
   * Отменить заказ
   */
  async cancelOrder(id: string): Promise<OrderWithItems | null> {
    return this.updateOrderStatus(id, { status: 'CANCELLED' });
  },

  /**
   * Получить заказы по email клиента
   */
  async getOrdersByCustomerEmail(email: string): Promise<OrderWithItems[]> {
    return prisma.order.findMany({
      where: {
        customerEmail: email,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },
};
