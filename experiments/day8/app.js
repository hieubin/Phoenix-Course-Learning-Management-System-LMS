import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.routes.js';
import postsRouter from './routes/posts.routes.js';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';
import sessionMiddleware from './middlewares/session.js';
import { sendSuccess } from './lib/response.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({ origin: 'http://localhost:4200' }));

app.use(sessionMiddleware);

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.get('/', (req, res) => {
  sendSuccess(res, null, 200, 'Day 8 Prisma CRUD server');
});

// 404 for unmatched routes (API)
app.use((req, res) => {
  res.status(404).json({ success: false, data: null, message: 'Not Found' });
});

// Centralized error handler (must be last)
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
