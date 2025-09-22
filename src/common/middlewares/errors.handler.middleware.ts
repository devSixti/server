import { Request, Response, NextFunction } from "express";

export const errorsCatcher = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err.message, err.statusCode);

    // Check if the error is a custom error
    res.status(err.statusCode || 500).json({
        statusCode: err.statusCode || 500,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
        errorType: err.name || 'UnknownError',
        message: err.message,
    });

    next();
};