const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3001';
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'internal-secret';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  category?: string;
  imageUrl?: string;
}

class ProductClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = `${PRODUCT_SERVICE_URL}/_internal/products`;
    this.headers = {
      'Content-Type': 'application/json',
      'X-Internal-API-Key': INTERNAL_API_KEY,
    };
  }

  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(this.baseUrl, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    return response.json() as Promise<Product[]>;
  }

  async getProductById(id: string): Promise<Product | null> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    return response.json() as Promise<Product>;
  }

  async createProduct(data: CreateProductData): Promise<Product> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`);
    }

    return response.json() as Promise<Product>;
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<Product> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: this.headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`);
    }

    return response.json() as Promise<Product>;
  }

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`);
    }

    return response.json() as Promise<{ success: boolean; message: string }>;
  }

  async checkStock(id: string, quantity: number): Promise<{ inStock: boolean }> {
    const response = await fetch(`${this.baseUrl}/${id}/stock/${quantity}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to check stock: ${response.statusText}`);
    }

    return response.json() as Promise<{ inStock: boolean }>;
  }

  async decreaseStock(id: string, quantity: number): Promise<{ success: boolean; newStockQuantity: number }> {
    const response = await fetch(`${this.baseUrl}/${id}/decrease-stock`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error(`Failed to decrease stock: ${response.statusText}`);
    }

    return response.json() as Promise<{ success: boolean; newStockQuantity: number }>;
  }
}

export const productClient = new ProductClient(); 