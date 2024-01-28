import { APIForbiddenError, APIInternalServerError } from "@/app/errors/api.error";
import { Logger } from "../logger.service";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * Namespace for server-side services to interact with the login API.
 */
export namespace serverLoginService {
    if (!process.env.APP_PASSWORD || !process.env.JWT_SECRET) {
        throw new APIInternalServerError('Server configuration error: Required environment variables are undefined');
    }

    const APP_PASSWORD = bcrypt.hashSync(process.env.APP_PASSWORD, 10);
    const JWT_SECRET = process.env.JWT_SECRET as string;

    /**
     * Generate a JWT token
     */
    const generateJWTToken = (userId: string): string => {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
    }

    /**
     * Check if a JWT token is valid
     * @param token The token to check
     * @returns true if the token is valid, false otherwise
     */
    export const isLoggedIn = (token: string): boolean => {
        try {
            jwt.verify(token, JWT_SECRET);
        } catch (e) {
            Logger.debug('Invalid JWT token: ' + (e as Error).message);
            return false;
        }
        return true;
    }

    /**
     * Login with a password
     * @param login the password to login with
     * @returns A JWT token if the password is correct, an error otherwise
     */
    export const login = async (login: { password: string }): Promise<{ token: string }> => {
        const userPassword = login.password;

        if (!bcrypt.compareSync(userPassword, APP_PASSWORD)) {
            throw new APIForbiddenError('Invalid password');
        }

        const token = generateJWTToken('user_id'); // Replace 'user_id' with actual user identifier

        return { token };
    };
}
