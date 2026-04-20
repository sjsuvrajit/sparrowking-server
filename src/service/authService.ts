import bcrypt from "bcrypt";
import User from "../models/User";
import { ConflictError, UnauthorizedError } from "../utils/error";
import { RegisterInput, LoginInput } from "../validators/authValidators";
import { JwtUtills } from "../utils/jwt";

class AuthService {
    // Register a new user
    async registerUser(data: RegisterInput) {
        const { email, password, full_name } = data;

        //check if user is already exists
        const existingUser = await User.findOne({ where: { email } });
        if(existingUser) {
            throw new ConflictError("User with this email already exists");
        }

        //Hash the password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        //Create new user
        const user = await User.create({
            email,
            password_hash,
            full_name,
            role: "customer", //default role
        });
        return this.sanitizeUser(user);
    }

    // Login User
    async loginUser(data: LoginInput) {
        const { email, password } = data;

        //Find user by email
        const user = await User.findOne({ where: { email } });
        if(!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        //Compare password with hash
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordValid) {
            throw new UnauthorizedError("Invalid email or password");
        }

        //Generate JWT token
        const token = JwtUtills.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        return {
            user: this.sanitizeUser(user),
            token,
        };
    }

    //Remove sensitive fields before sending user data to client
    private sanitizeUser(user: any) {
        const userObj = user.toJSON();
        delete userObj.password_hash; // Remove password hash from the user object
        return userObj;
    }
}

export default new AuthService();