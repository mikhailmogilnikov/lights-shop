import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'admin-panel-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

export const generateToken = async (payload: { userId: string; email: string }): Promise<string> => {
  const token = await sign(
    {
      ...payload,
      role: 'admin' as const,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 часа
    },
    JWT_SECRET
  );
  
  return token;
};

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    const payload = await verify(token, JWT_SECRET);
    
    // Проверяем структуру payload
    if (
      typeof payload === 'object' && 
      payload !== null &&
      'userId' in payload &&
      'email' in payload &&
      'role' in payload
    ) {
      return payload as unknown as JWTPayload;
    }
    
    return null;
  } catch (error) {
    console.error('JWT verification failed:', error);

    return null;
  }
}; 