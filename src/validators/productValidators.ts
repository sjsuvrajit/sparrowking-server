import { compare } from "bcrypt";
import { z } from "zod";

// Create product validation
export const createProductSchema = z.object({
  category_id: z
    .number({
      message: "Category ID is required and must be a number",
    })
    .int("Category ID must be an integer")
    .positive("Category ID must be a positive"),

  name: z
    .string({
      message: "Product name is required",
    })
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name must be at most 200 characters")
    .trim(),

  slug: z
    .string({
      message: "Product slug is required",
    })
    .min(2, "Product slug must be at least 2 characters")
    .max(200, "Product slug must be at most 200 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Product slug must be URL-friendly (lowercase letters, numbers, and hyphens only)",
    )
    .trim(),

  description: z
    .string()
    .max(2000, "Product description must be at most 2000 characters")
    .optional(),

  price: z
    .number({
      message: "Product price is required and must be a number",
    })
    .positive("Product price must be a positive number")
    .multipleOf(0.01, "Product price must have at most 2 decimal places"),

  compare_price: z
    .number()
    .positive("Compare price must be a positive number")
    .multipleOf(0.01, "Compare price must have at most 2 decimal places")
    .optional(),

  cost_price: z
    .number()
    .positive("Cost price must be a positive number")
    .multipleOf(0.01, "Cost price must have at most 2 decimal places")
    .optional(),

  stock_quantity: z
    .number()
    .int("Stock quantity must be an integer")
    .nonnegative("Stock quantity cannot be negative")
    .optional()
    .default(0),

  sku: z.string().max(100, "SKU must be at most 100 characters").optional(),

  image_url: z.string().url("Invalid image URL").optional(),

  images: z.array(z.string().url("Invalid image URL")).optional().default([]),

  is_active: z.boolean().optional().default(true),
});

// Update product validation schema(all fields optional)
export const updateProductSchema = z.object({
  category_id: z.number().int().positive().optional(),
  name: z.string().min(2).max(200).trim().optional(),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .trim()
    .optional(),
  description: z.string().max(2000).optional(),
  price: z.number().positive().multipleOf(0.01).optional(),
  compare_price: z.number().positive().multipleOf(0.01).optional(),
  cost_price: z.number().positive().multipleOf(0.01).optional(),
  stock_quantity: z.number().int().nonnegative().optional(),
  sku: z.string().max(100).optional(),
  image_url: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  is_active: z.boolean().optional(),
});

// Typescript types
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
