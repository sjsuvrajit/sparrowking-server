import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import Product from "../models/Product";
import Category from "../models/Category";
import { NotFoundError, ConflictError, ValidationError } from "../utils/error";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../validators/productValidators";
import { Op } from "sequelize";

/**
 * Get all products with pagination and filtering
 * GET /api/products
 */
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      category_id,
      is_active,
      search,
      sort_by = "created_at",
      order = "DESC",
    } = req.query;

    // Build where clause for filtering
    const where: any = {};

    if (category_id) {
      where.category_id = Number(category_id);
    }

    if (is_active !== undefined) {
      where.is_active = is_active === "true";
    }

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` }; // Case-insensitive search
    }

    // calculate pagination
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit))); // Ensure limit is between 1 and 100
    const offset = (pageNum - 1) * limitNum;

    // Fetch products with pagination
    const { rows: products, count: totalProducts } =
      await Product.findAndCountAll({
        where,
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "slug"],
          },
        ],
        limit: limitNum,
        offset,
        order: [[sort_by as string, order as string]],
        distinct: true, // Ensure correct count when using include
      });

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / limitNum);

    sendSuccess(
      res,
      {
        products,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalProducts,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPreviousPage: pageNum > 1,
        },
      },
      "Products retrieved successfully",
    );
  },
);

/**
 * Get product by slug
 * GET /api/products/:slug
 */

export const getProductBySlug = asyncHandler(
  async (req: Request, res: Response) => {
    const { slug } = req.params;

    const product = await Product.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    sendSuccess(res, { product }, "Product retrieved successfully");
  },
);

/**
 * Create new Product(admin only)
 * POST /api/products
 */
export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body as CreateProductInput;

    // Check if category exists
    const category = await Category.findByPk(data.category_id);
    if (!category) {
      throw new ValidationError("Category not found");
    }

    //check if slug already exists
    const existingProduct = await Product.findOne({
      where: { slug: data.slug },
    });
    if (existingProduct) {
      throw new ConflictError("Product with this slug already exists");
    }

    // check if sku already exists (if provided)
    if (data.sku) {
      const existingSku = await Product.findOne({ where: { sku: data.sku } });
      if (existingSku) {
        throw new ConflictError("Product with this SKU already exists");
      }
    }
    const productData: any = {
      category_id: data.category_id,
      name: data.name,
      slug: data.slug,
      price: data.price,
      stock_quantity: data.stock_quantity,
      images: data.images,
      is_active: data.is_active,
    };

    // Add optional fields only if they exist
    if (data.description !== undefined)
      productData.description = data.description;
    if (data.compare_price !== undefined)
      productData.compare_price = data.compare_price;
    if (data.cost_price !== undefined) productData.cost_price = data.cost_price;
    if (data.sku !== undefined) productData.sku = data.sku;
    if (data.image_url !== undefined) productData.image_url = data.image_url;

    const product = await Product.create(productData);

    //Fetch the created product with category details
    const productWithCategory = await Product.findByPk(product.id, {
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    sendSuccess(
      res,
      { product: productWithCategory },
      "Product created successfully",
      201,
    );
  },
);

/**
 * Update product (admin only)
 * PUT /api/products/:id
 */
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body as UpdateProductInput;

    const product = await Product.findByPk(parseInt(id as string));
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // verify category exists if changing category
    if (data.category_id && data.category_id !== product.category_id) {
      const category = await Category.findByPk(data.category_id);
      if (!category) {
        throw new ValidationError("Category not found");
      }
    }

    // check if slug already exists for another product
    if (data.slug && data.slug !== product.slug) {
      const existingProduct = await Product.findOne({
        where: { slug: data.slug },
      });
      if (existingProduct) {
        throw new ConflictError("Product with this slug already exists");
      }
    }

    // check if sku already exists for another product (if provided)
    if (data.sku && data.sku !== product.sku) {
      const existingSku = await Product.findOne({ where: { sku: data.sku } });
      if (existingSku) {
        throw new ConflictError("Product with this SKU already exists");
      }
    }

    // Filter out undefined values for update
    const updateData: any = {};
    if (data.category_id !== undefined)
      updateData.category_id = data.category_id;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.compare_price !== undefined)
      updateData.compare_price = data.compare_price;
    if (data.cost_price !== undefined) updateData.cost_price = data.cost_price;
    if (data.stock_quantity !== undefined)
      updateData.stock_quantity = data.stock_quantity;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    await product.update(updateData);

    // Fetch updated product with category details
    const updatedProduct = await Product.findByPk(id as string, {
      include: [{ model: Category, as: "category" }],
    });

    sendSuccess(
      res,
      { product: updatedProduct },
      "Product updated successfully",
    );
  },
);

/**
 * Delete product (admin only)
 * DELETE /api/products/:id
 */
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findByPk(parseInt(id as string));
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    await product.destroy();

    sendSuccess(res, null, "Product deleted successfully");
  },
);
