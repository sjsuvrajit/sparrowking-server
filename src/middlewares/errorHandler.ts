import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //Default to 500 server error if status code is not set
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors: any = undefined;

    // Handle custom AppError
    if(err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Handel Sequelize validations errors
    if(err.name === "SequelizeValidationError") {
        statusCode = 400;
        message = "validation Error";
        errors = (err as any).errors.map((e: any) => ({
            field: e.path,
            message: e.message,
        }));
    }

    // Handle Sequelize unique constraint errors
    if(err.name === "SequelizeUniqueConstraintError") {
        statusCode = 409;
        message = "Resource already exists";
        errors = (err as any).errors.map((e: any) => ({
            field: e.path,
            message: e.message,
        }));
    }

    //Log error in development
    if(process.env.NODE_ENV === "development") {
        console.error("Error: ", err);
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};