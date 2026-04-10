import { Router } from "express";
import { register } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { registerSchema } from "../validators/authValidators";

const router = Router();

// POST /api/auth/register - Register a new user
router.post(
    "/register",
    validate(registerSchema), // validate input first
    register  // Then call the controller to handle registration logic
)

export default router;
