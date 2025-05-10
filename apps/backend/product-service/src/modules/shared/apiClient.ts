/**
 * API-клиент для взаимодействия между микросервисами
 * Автоматически добавляет нужные заголовки для авторизации
 */

export class InternalApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey || process.env.INTERNAL_API_KEY || 'internal-api-key-secret';
  }

  /**
   * Выполняет GET-запрос к внутреннему API другого сервиса
   */
  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  }

  /**
   * Выполняет POST-запрос к внутреннему API другого сервиса
   */
  async post<T, D = Record<string, unknown>>(path: string, data: D): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  }

  /**
   * Выполняет PUT-запрос к внутреннему API другого сервиса
   */
  async put<T, D = Record<string, unknown>>(path: string, data: D): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  }

  /**
   * Выполняет PATCH-запрос к внутреннему API другого сервиса
   */
  async patch<T, D = Record<string, unknown>>(path: string, data: D): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  }

  /**
   * Выполняет DELETE-запрос к внутреннему API другого сервиса
   */
  async delete<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json() as T;
  }

  /**
   * Возвращает заголовки с API-ключом для авторизации
   */
  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-Internal-API-Key': this.apiKey,
    };
  }
}

// Создаем и экспортируем клиент для order-service
export const orderServiceClient = new InternalApiClient(
  process.env.ORDER_SERVICE_URL || 'http://order-service:3002',
); 