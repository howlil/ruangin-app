const { logger } = require("../apps/logging.js");
const { ResponseError,NotFoundError,ValidationError,UnauthorizedError } = require("../utils/responseError.js");
const multer = require('multer')

const formatErrorResponse = (error = true, message, errors = null) => {
    const response = { error, message };
    if (errors) response.errors = errors;
    return response;
};

const logError = (err, req) => {
    logger.error({
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        requestBody: req.body,
        requestParams: req.params,
        requestQuery: req.query,
        userId: req.user?.id 
    });
};

const errorMiddleware = (err, req, res, next) => {
    if (!err) return next();

    // Log all errors
    logError(err, req);

    switch (true) {
        case err instanceof multer.MulterError:
            return res.status(400).json(
                formatErrorResponse(true, `File upload error: ${err.message}`)
            );

        case err instanceof ValidationError:
            return res.status(err.status).json(
                formatErrorResponse(true, err.message, err.errors)
            );

        case err instanceof NotFoundError:
            return res.status(err.status).json(
                formatErrorResponse(true, err.message)
            );

        case err instanceof UnauthorizedError:
            return res.status(err.status).json(
                formatErrorResponse(true, err.message)
            );

        case err instanceof ResponseError:
            return res.status(err.status).json(
                formatErrorResponse(true, err.message, err.errors)
            );

        // Handle Mongoose/MongoDB errors
        case err.name === 'MongoError' || err.name === 'MongoServerError':
            if (err.code === 11000) {
                return res.status(409).json(
                    formatErrorResponse(true, 'Duplicate entry found')
                );
            }
            break;

        // Handle JWT errors
        case err.name === 'JsonWebTokenError':
            return res.status(401).json(
                formatErrorResponse(true, 'Invalid token')
            );

        case err.name === 'TokenExpiredError':
            return res.status(401).json(
                formatErrorResponse(true, 'Token expired')
            );
    }

    const isDevelopment = process.env.NODE_ENV === 'development';
    const message = isDevelopment ? err.message : 'Internal Server Error';
    const errorDetails = isDevelopment ? err.stack : undefined;

    // Handle unknown errors
    return res.status(500).json(
        formatErrorResponse(true, message, errorDetails)
    );
};


module.exports = { errorMiddleware };