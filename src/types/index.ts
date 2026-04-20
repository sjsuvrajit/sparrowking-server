//JWT payload type
export interface JwtPayload {
    userId: number;
    email: string;
    role: "customer" | "admin"; // Assuming we have two roles: customer and admin
}

// Auth response type
export interface AuthResponse {
    user: {
        id: number;
        email: string;
        full_name: string;
        role: "customer" | "admin";
        createdAt: Date;
        updatedAt: Date;
    };
    token: string;
}

// Extended Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload; // Optional user property added to the Request interface
        }
    }
}