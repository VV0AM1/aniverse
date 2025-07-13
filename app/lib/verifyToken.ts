import jwt from 'jsonwebtoken';

export function verifyToken(authorizationHeader: string | null): { userId: string } | null {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) return null;

  const token = authorizationHeader.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch {
    return null;
  }
}