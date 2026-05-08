import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidators";

const router = Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Admin-only routes
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  createProduct,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateProductSchema),
  updateProduct,
);

router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

export default router;
