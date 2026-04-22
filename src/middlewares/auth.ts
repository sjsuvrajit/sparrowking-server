import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { UnauthorizedError, ForbiddenError } from "../utils/error";
import { JwtUtills } from "../utils/jwt";
import { JwtPayload } from "../types";

// Verify JWT token and attach user info to request object
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    //get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("Access token is required");
    }

    // Authorization header format: "Bearer <token>"
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError("Invalid token format. Use Bearer <token>");
    }

    const token = parts[1]!;

    try {
      //verify and decode token
      const decoded = JwtUtills.verifyToken(token);

      // Attach user info to request object for later use
      req.user = decoded as JwtPayload;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  },
);

// check if authenticated user has the required role(s)
export const authorize = (...allowedRoles: string[]) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // User must be authenticated first (authenticate middleware should run before this)
      if (!req.user) {
        throw new UnauthorizedError("Authentication required");
      }

      // Check if user's role is in the list of allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError(
          `Access denied. Required role(s): ${allowedRoles.join(" or ")}`,
        );
      }

      // User has the required role, proceed to the next middleware or route handler
      next();
    },
  );
};
