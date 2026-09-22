import HttpError from '../errors/httpError.js';
import { Prisma } from '@prisma/client';

export default function errorHandler(err, req, res, next) {
  // Prisma known request errors have code property
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const code = err.code;
    if (code === 'P2002') {
      return res.status(409).json({ success: false, data: null, message: 'Email already exists' });
    }
    if (code === 'P2025') {
      return res.status(404).json({ success: false, data: null, message: 'Resource not found' });
    }
    if (code === 'P2003') {
      return res.status(400).json({ success: false, data: null, message: 'Invalid relation' });
    }
    // fallback for other Prisma errors
    console.error(err);
    return res.status(500).json({ success: false, data: null, message: 'Internal Server Error' });
  }

  if (err && err.name === 'HttpError') {
    return res.status(err.status || 500).json({ success: false, data: null, message: err.message });
  }

  // Other errors
  console.error(err);
  return res.status(500).json({ success: false, data: null, message: 'Internal Server Error' });
}
