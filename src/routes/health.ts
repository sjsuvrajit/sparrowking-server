import { Router, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess, sendError } from "../utils/response";
import { query } from "../config/database";
import Product from "../models/Product";
import Category from "../models/Category";

const router = Router();

// Health check endpoint
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const dbResult = await query("SELECT NOW() as current_time");

    sendSuccess(
      res,
      {
        status: "ok",
        timeStamp: new Date(),
        database: "connected",
        databaseTime: dbResult.rows[0].current_time,
      },
      "API is healthy",
    );
  }),
);

// Test relationship
router.get(
  "/test-products",
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price", "stock_quantity"],
        },
      ],
    });

    sendSuccess(res, { categories }, "Categories with products");
  }),
);

export default router;
