/**
 * Интерфейс продукта из сервиса продуктов
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Клиент для взаимодействия с микросервисом продуктов
 */
export class ProductClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    const productServiceUrl = process.env.PRODUCT_SERVICE_URL;
    
    if (!productServiceUrl) {
      throw new Error('PRODUCT_SERVICE_URL environment variable is not set');
    }
    
    this.baseUrl = productServiceUrl.replace(/\/$/, '');
    
    const apiKey = process.env.INTERNAL_API_KEY;
    
    if (!apiKey) {
      throw new Error('INTERNAL_API_KEY environment variable is not set');
    }
    
    this.apiKey = apiKey;
  }

  /**
   * Проверяет наличие товара в нужном количестве
   */
  async checkStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/_internal/products/${productId}/stock/${quantity}`,
        {
          headers: {
            'X-Internal-API-Key': this.apiKey
          }
        }
      );
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();

      return data.inStock === true;
    } catch (error) {
      console.error(`Error checking stock for product ${productId}:`, error);

      return false;
    }
  }

  /**
   * Уменьшает количество товара на складе после оформления заказа
   */
  async decreaseStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/_internal/products/${productId}/decrease-stock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Internal-API-Key': this.apiKey
          },
          body: JSON.stringify({ quantity })
        }
      );
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();

      return data.success === true;
    } catch (error) {
      console.error(`Error decreasing stock for product ${productId}:`, error);

      return false;
    }
  }
  
  /**
   * Получает информацию о товаре
   */
  async getProduct(productId: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}`);
      
      if (!response.ok) {
        return null;
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);

      return null;
    }
  }
}

export const productClient = new ProductClient(); 