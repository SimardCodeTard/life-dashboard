import { APIForbiddenError, APIInternalServerError } from "@/app/errors/api.error";
import { Logger } from "../logger.service";
import { SignJWT, jwtVerify } from 'jose';

/**
 * Namespace for server-side services to interact with the login API.
 */
export namespace serverLoginService {
    // Ensure required environment variables are defined
    if (!process.env.APP_PASSWORD || !process.env.JWT_SECRET) {
        throw new APIInternalServerError('Server configuration error: Required environment variables are undefined');
    }

    const APP_PASSWORD = process.env.APP_PASSWORD as string;
    const JWT_SECRET = process.env.JWT_SECRET as string;

    /**
     * Generate a JWT token
     * @param userId The user ID to include in the token payload
     * @param lifetime The token lifetime in seconds (default is one day)
     * @returns A promise that resolves to the generated JWT token
     */
    const generateJWTToken = (
        userId: string, 
        lifetime = 60 * 60 * 24 // one day
    ): Promise<string> => {
        const iat = Math.floor(Date.now() / 1000);
        const exp = iat + lifetime; 

        return new SignJWT({ userId })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(new TextEncoder().encode(JWT_SECRET));
    }

    /**
     * Validate a token or refresh it if invalid
     * @param param0 An object containing the token and refresh token
     * @returns A promise that resolves to true if the token is valid, false if both tokens are invalid, or an object with a new token if the refresh token is valid
     */
    export const validateTokenOrRefreshToken = async ({ token, refreshToken }: { token: string, refreshToken: string }): Promise<boolean | { token: string }> => {
        try {
            if (!token) throw new Error('No token provided');
            await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        } catch (e) {
            Logger.debug('Invalid JWT token: ' + token);
            Logger.error(e as Error);

            try {
                if (!refreshToken) throw new Error('No refresh token provided');
                await jwtVerify(refreshToken, new TextEncoder().encode(JWT_SECRET));
                const newToken = await generateJWTToken('user_id');
                return { token: newToken };
            } catch (e) {
                Logger.debug('Invalid JWT refresh token: ' + refreshToken);
                Logger.error(e as Error);
            }
            return false;
        }
        return true;
    }

    /**
     * Check if a JWT token is valid
     * @param token The token to check
     * @returns true if the token is valid, false otherwise
     */
    export const isLoggedIn = (token?: string): boolean => {
        try {
            if (!token) throw new Error('No token provided');
            jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        } catch (e) {
            Logger.debug('Invalid JWT token: ' + (e as Error).message + ', token: ' + token?.toString() + ', type: ' + typeof token);
            return false;
        }
        return true;
    }

    /**
     * Login with a password
     * @param login The password to login with
     * @returns A promise that resolves to an object containing the JWT token and refresh token if the password is correct, throws an error otherwise
     */
    export const login = async (login: { password: string }): Promise<{ token: string, refreshToken: string }> => {
        const userPassword = login.password;

        if (userPassword !== APP_PASSWORD) {
            throw new APIForbiddenError('Invalid password');
        }

        const token = await generateJWTToken('user_id');
        const refreshToken = await generateJWTToken('user_id', 60 * 60 * 24 * 90); // 3 months
        
        return { token, refreshToken };
    };
}
