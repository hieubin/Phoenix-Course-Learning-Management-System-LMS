import HttpError from '../errors/httpError.js';
import { verifyToken } from '../lib/jwt.js';

export default function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  const parts = authorization?.trim().split(/\s+/) || [];
  const [scheme, token, ...extra] = parts;

  if (scheme !== 'Bearer' || !token || extra.length > 0) {
    return next(new HttpError(401, 'Unauthorized'));
  }

  try {
    const claims = verifyToken(token);
<<<<<<< HEAD
    req.user = { id: claims.userId };
=======
    if (!claims.role) {
      return next(new HttpError(401, 'Unauthorized'));
    }
    req.user = { id: claims.userId, role: claims.role };
>>>>>>> 1f0e04a (feat: complete day11)
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new HttpError(401, 'Unauthorized'));
    }
    next(error);
  }
}