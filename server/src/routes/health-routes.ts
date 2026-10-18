import {Router} from 'express';

const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'OK',
            service: 'SalesFlow-api',
            timestamp: new Date().toISOString(),
        }
    })
})

export default healthRouter;