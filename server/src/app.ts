import 'dotenv/config';
import cors from 'cors';
import express from 'express';
 
import errorHandler from './middleware/error-handler.ts';
import healthRouter from './routes/health-routes.ts';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
}));

app.use('/api', healthRouter);

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