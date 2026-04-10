import { z } from "zod";

// Registration validation schema
export const registerSchema = z.object({
    email: z
        .string({
            message: "Email is required",
        })
        .email({message: "Invalid email address"})
        .toLowerCase()
        .trim(),

    password: z
        .string({
            message: "Password is required",    
        })
        .min(8, {message: "Password must be at least 8 characters long"})
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),

    full_name: z
        .string({
            message: "Full name is required",
        })
        .min(2, {message: "Full name must be at least 2 characters long"})
        .max(100, {message: "Full name must be less than 100 characters long"})
        .trim(),
});

// TypeScript type for inferred from the schema
export type RegisterInput = z.infer<typeof registerSchema>;