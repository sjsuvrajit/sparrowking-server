import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import authService from "../service/authService";
import { RegisterInput, LoginInput } from "../validators/authValidators";
import { send } from "node:process";

export const register = asyncHandler(async (req: Request, res: Response) => {
    // Type-safe request body (validation already done by middleware)
    const userData = req.body as RegisterInput;

    // call the service layer to handle registration logic
    const user = await authService.registerUser(userData);

    // send success response
    sendSuccess(res, { user }, "User registered successfully", 201);
});

// Login
export const login = asyncHandler(async (req: Request, res: Response) => {
    const loginData = req.body as LoginInput;
    const { user, token } = await authService.loginUser(loginData);

    sendSuccess(
        res, { user, token, expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    ),
    "Login successful"
});