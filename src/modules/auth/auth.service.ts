import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config';

export const authService = {
  /** 生成 JWT */
  sign(uid: number) {
    return jwt.sign({ uid }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  },

  /** 验证 JWT */
  verify(token: string) {
    return jwt.verify(token, JWT_SECRET) as { uid: number };
  },
};
