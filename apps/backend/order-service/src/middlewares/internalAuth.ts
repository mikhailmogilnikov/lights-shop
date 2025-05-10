import type { Context, Next } from 'hono';

/**
 * Middleware для защиты внутренних API-эндпоинтов
 * Проверяет наличие валидного API-ключа в заголовке запроса
 * и что запрос поступает из доверенной сети
 */
export async function internalAuth(c: Context, next: Next) {
  // Проверка API-ключа
  const apiKey = c.req.header('X-Internal-API-Key');
  const validApiKey = process.env.INTERNAL_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return c.json({ error: 'Unauthorized', message: 'Invalid or missing API key' }, 401);
  }

  // Проверка IP-адреса (Docker использует внутреннюю сеть)
  // В Docker Compose все сервисы в одной сети, поэтому можно определить доверенные IP
  const clientIP = c.req.header('X-Forwarded-For') || c.env?.getClientIP?.();

  // Доверенные IP: localhost, Docker-сеть, и т.д.
  const trustedIPs = ['127.0.0.1', 'localhost', '::1'];

  // В Docker все контейнеры внутри сети имеют IP в пределах внутренней сети
  // Часто это 172.x.x.x, 10.x.x.x или 192.168.x.x
  const isDockerNetwork =
    clientIP?.startsWith('172.') || clientIP?.startsWith('10.') || clientIP?.startsWith('192.168.');

  if (clientIP && !trustedIPs.includes(clientIP) && !isDockerNetwork) {
    return c.json(
      {
        error: 'Forbidden',
        message: 'Access denied from untrusted network',
      },
      403,
    );
  }

  await next();
}
