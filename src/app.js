import express from 'express';
import cors from 'cors';

const app = express();

import userRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';
import morgan from 'morgan';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import { authenticateToken } from './middlewares/authenticate.js';

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/login', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', authenticateToken, tasksRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;