import { Router } from "express";
import { register, login, logout } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../validators/authValidators";
import { authenticate } from "../middlewares/auth";

const router = Router();

// POST /api/auth/register - Register a new user
router.post(
  "/register",
  validate(registerSchema), // validate input first
  register, // Then call the controller to handle registration logic
);

// POST /api/auth/login - Login user
router.post("/login", validate(loginSchema), login);

// POST /api/auth/logout - Logout user
router.post("/logout", authenticate, logout);

export default router;
