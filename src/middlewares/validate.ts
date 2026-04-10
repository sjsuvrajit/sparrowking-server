import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { ValidationError } from "../utils/error";

// Generic validation middleware using Zod schemas
export const validate = (schema: ZodType<any>) => {
    return async (req: Request, res: Response, next:NextFunction) => {
        try {
            // Validate request body against the provided schema
            await schema.parseAsync(req.body);
            next(); // Validation Passed, proceed to the next middleware/ controller
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod errors
                const errors = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message,
                }));

                // Pass a custom validation error to the global error handler
                next(new ValidationError(JSON.stringify(errors)));
            } else {
                next(error); // Pass any other errors to the global error handler
            }
        }
    }
}