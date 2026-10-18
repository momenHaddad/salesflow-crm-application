import type {ErrorRequestHandler} from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred. Please try again later.',
        }
    })
}

export default errorHandler;