import 'dotenv/config';
import cors from 'cors';
import express from 'express';
 
import errorHandler from './middleware/error-handler.ts';
import healthRouter from './routes/health-routes.ts';

import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth.ts';

import sessionRouter from './routes/session.routes.ts';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
}));

app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json({ limit: '1mb' }))

app.use('/api', healthRouter);

app.use('/api', sessionRouter)

// response for unknown routes
app.use( (req, res) =>{
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'The requested endpoint was not found.',
        }
    })
})

app.use(errorHandler);

export default app;