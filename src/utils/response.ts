import { Response } from "express";

interface successResponse {
    success: true;
    message?: string;
    data?: any;
    meta?: any;
}

interface errorResponse {
    success: false;
    message: string;
    errors?: any;
}

export const sendSuccess = (
    res: Response,
    data: any = null,
    message: string = "Request successful",
    statusCode: number = 200,
    meta?: any
) => {
    const response: successResponse = {
        success: true,
        message,
        ...(data && { data }),
        ...(meta && { meta }),
    };
    res.status(statusCode).json(response);
};

export const sendError = (
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any
) => {
    const response: errorResponse = {
        success: false,
        message,
        ...(errors && { errors }),
    };
    res.status(statusCode).json(response);
};