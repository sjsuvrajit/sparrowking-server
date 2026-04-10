import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import authService from "../service/authService";
import { RegisterInput } from "../validators/authValidators";

export const register = asyncHandler(async (req: Request, res: Response) => {
    // Type-safe request body (validation already done by middleware)
    const userData = req.body as RegisterInput;

    // call the service layer to handle registration logic
    const user = await authService.registerUser(userData);

    // send success response
    sendSuccess(res, { user }, "User registered successfully", 201);
})