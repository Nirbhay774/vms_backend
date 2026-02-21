import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { setServers } from 'node:dns/promises';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Fix DNS resolution for MongoDB Atlas on restricted networks
setServers(['1.1.1.1', '8.8.8.8']);

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// 404 Handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found',
    });
});

// Global Error Handler
app.use(errorHandler);

export default app;
