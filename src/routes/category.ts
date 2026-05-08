import { Router } from "express";
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categoryValidators";

const router = Router();

// Public routes
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

// Protected routes (admin only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  createCategory,
);

router.put(
  "/:slug",
  authenticate,
  authorize("admin"),
  validate(updateCategorySchema),
  updateCategory,
);

router.delete("/:slug", authenticate, authorize("admin"), deleteCategory);

export default router;
