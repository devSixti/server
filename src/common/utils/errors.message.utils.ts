export class ErrorMsg extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}