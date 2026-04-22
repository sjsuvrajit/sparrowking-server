import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import User from "../models/User";
import { NotFoundError } from "../utils/error";

// Get current authenticated user
// GET /api/users/me
export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    // req.user is set by the authenticate middleware
    const userId = req.user!.userId;

    // Fetch user details from the database
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password_hash"] }, // Exclude sensitive fields
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    sendSuccess(res, { user }, "User details fetched successfully");
  },
);

// Update current authenticated user
// PUT /api/users/me
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { full_name } = req.body;

    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Update allowed fields only
    if (full_name) {
      user.full_name = full_name;
    }

    await user.save();

    // Remove password hash before sending response
    const { password_hash, ...userObj } = user.toJSON();

    sendSuccess(res, { user: userObj }, "Profile updated successfully");
  },
);

// get all users (admin only)
// GET /api/users
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: { exclude: ["password_hash"] }, // Exclude sensitive fields
    order: [["created_at", "DESC"]],
  });

  sendSuccess(
    res,
    { users, count: users.length },
    "Users fetched successfully",
  );
});
