import bcrypt from "bcrypt";
import User from "../models/User";
import { ConflictError } from "../utils/error";
import { RegisterInput } from "../validators/authValidators";

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

    //Remove sensitive fields before sending user data to client
    private sanitizeUser(user: any) {
        const userObj = user.toJSON();
        delete userObj.password_hash; // Remove password hash from the user object
        return userObj;
    }
}

export default new AuthService();