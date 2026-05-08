import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import Category, { CategoryAttributes } from "../models/Category";
import Product from "../models/Product";
import { NotFoundError, ConflictError } from "../utils/error";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../validators/categoryValidators";

// Get all categories
// GET /api/categories
export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { include_products } = req.query;

    const options: any = {
      order: [["name", "ASC"]],
    };

    //optionally include products count
    if (include_products === "true") {
      options.include = [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "slug", "price", "stock_quantity"],
          where: { is_active: true },
          required: false, // LEFT JOIN: Include categories even if they have no products
        },
      ];
    }
    const categories = await Category.findAll(options);

    sendSuccess(
      res,
      { categories, count: categories.length },
      "Categories retrieved successfully",
    );
  },
);

// Get category by slug
// GET /api/categories/:slug
export const getCategoryBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    const category = await Category.findOne({
      where: { slug },
      include: [
        {
          model: Product,
          as: "products",
          where: { is_active: true },
          required: false, // LEFT JOIN: Include category even if it has no products
        },
      ],
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    sendSuccess(res, { category }, "Category retrieved successfully");
  },
);

// Create new category(admin only)
// POST /api/categories
export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body as CreateCategoryInput;

    // Check for existing category with same slug
    const existingCategory = await Category.findOne({
      where: { slug: data.slug },
    });
    if (existingCategory) {
      throw new ConflictError("Category with this slug already exists");
    }

    const categoryData = {
      name: data.name,
      slug: data.slug,
      is_active: data.is_active ?? true,
      ...(data.description && { description: data.description }),
      ...(data.image_url && { image_url: data.image_url }),
    };
    const category = await Category.create(categoryData);

    sendSuccess(res, { category }, "Category created successfully", 201);
  },
);

// Update category(admin only)
// PUT /api/categories/:id
export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as UpdateCategoryInput;

    const category = await Category.findByPk(parseInt(id as string));
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    // If slug is being updated, check for conflicts
    if (data.slug && data.slug !== category.slug) {
      const existingCategory = await Category.findOne({
        where: { slug: data.slug },
      });
      if (existingCategory) {
        throw new ConflictError(
          "Another category with this slug already exists",
        );
      }
    }

    const updateData: Partial<CategoryAttributes> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    await category.update(updateData);

    sendSuccess(res, { category }, "Category updated successfully");
  },
);

/**
 * Delete category(admin only)
 * DELETE /api/categories/:id
 */

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const category = await Category.findByPk(parseInt(id as string));
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    //check if category has products
    const productCount = await Product.count({ where: { category_id: id } });

    if (productCount > 0) {
      throw new ConflictError(
        `Cannot delete category with ${productCount} associated products. Please reassign or delete those products first.`,
      );
    }

    await category.destroy();

    sendSuccess(res, { category }, "Category deleted successfully");
  },
);
