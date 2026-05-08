import { z } from "zod";

//create category validation schema
export const createCategorySchema = z.object({
  name: z
    .string({
      message: "Category name is required",
    })
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be at most 100 characters")
    .trim(),

  slug: z
    .string({
      message: "Category slug is required",
    })
    .min(2, "Category slug must be at least 2 characters")
    .max(100, "Category slug must not exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Category slug must be URL-friendly (lowercase letters, numbers, and hyphens only)",
    )
    .trim(),

  description: z
    .string()
    .max(500, "Category description must be at most 500 characters")
    .optional(),

  image_url: z.string().url("Invalid image URL").optional(),

  is_active: z.boolean().optional().default(true),
});

// Update category validation schema(all fields optional)
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name must be at most 100 characters")
    .trim()
    .optional(),

  slug: z
    .string()
    .min(2, "Category slug must be at least 2 characters")
    .max(100, "Category slug must not exceed 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Category slug must be URL-friendly (lowercase letters, numbers, and hyphens only)",
    )
    .trim()
    .optional(),

  description: z
    .string()
    .max(500, "Category description must be at most 500 characters")
    .optional(),

  image_url: z.string().url("Invalid image URL").optional(),

  is_active: z.boolean().optional(),
});

// TypeScript types for category validation
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
