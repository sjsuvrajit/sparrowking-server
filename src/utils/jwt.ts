import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: number;
    email: string;
    role: string;
}

export class JwtUtills {
    private static secret: string = process.env.JWT_SECRET || "default_secret_key";
    private static expiresIn: string = process.env.JWT_EXPIRES_IN || "7d";

    // Generate Jwt token
    static generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
    }

    // Verify Jwt token and return the decoded payload
    static verifyToken(token: string): JwtPayload {
        try {
            const decoded = jwt.verify(token, this.secret) as JwtPayload;
            return decoded;
        } catch (error) {
            throw new Error("Invalid or expired token");
        }
    }

    // Decode token without verifying (for debugging)
    static decodeToken(token: string): JwtPayload | null {
        return jwt.decode(token) as JwtPayload | null;
    }
}