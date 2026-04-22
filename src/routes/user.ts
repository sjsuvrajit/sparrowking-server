import { Router } from "express";
import {
  getCurrentUser,
  updateProfile,
  getAllUsers,
} from "../controllers/userController";
import { authenticate, authorize } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { updateProfileSchema } from "../validators/userValidators";

const router = Router();

// All routes in this file require authentication
router.use(authenticate);

// GET /api/users/me - Get current authenticated user
router.get("/me", getCurrentUser);

// PUT /api/users/me - Update current authenticated user's profile
router.put("/me", validate(updateProfileSchema), updateProfile);

// GET /api/users - Get all users (admin only)
router.get("/", authorize("admin"), getAllUsers);

export default router;
