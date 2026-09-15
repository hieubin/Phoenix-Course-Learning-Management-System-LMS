import HttpError from '../errors/httpError.js';

export function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new HttpError(401, 'Unauthorized'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new HttpError(403, 'Forbidden'));
    }

    next();
  };
}