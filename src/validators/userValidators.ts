import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long" })
    .max(100, { message: "Full name must be less than 100 characters long" })
    .trim()
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
