import { APIForbiddenError, APIInternalServerError } from "@/app/errors/api.error";
import { Logger } from "../logger.service";
import { SignJWT, jwtVerify } from 'jose';

/**
 * Namespace for server-side services to interact with the login API.
 */
export namespace serverLoginService {
    if (!process.env.APP_PASSWORD || !process.env.JWT_SECRET) {
        throw new APIInternalServerError('Server configuration error: Required environment variables are undefined');
    }

    const APP_PASSWORD = process.env.APP_PASSWORD as string;
    const JWT_SECRET = process.env.JWT_SECRET as string;

    /**
     * Generate a JWT token
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

    export const validateTokenOrRefreshToken = async ({token, refreshToken}: {token: string, refreshToken: string}): Promise<boolean | { token: string }> => {
        try {
            if(!token) throw new Error('No token provided')
            jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        } catch (e) {
            Logger.debug('Invalid JWT token: ' + token);
            Logger.error(e as Error);

            try {
                if(!refreshToken) throw new Error('No refresh token provided')
                jwtVerify(refreshToken, new TextEncoder().encode(JWT_SECRET));
                const newToken = await generateJWTToken('user_id');
                return {token: newToken};
            } catch (e) {
                Logger.debug('Invalid JWT refresh token ' + refreshToken)
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
            if(!token) throw new Error('No token provided')
            jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        } catch (e) {
            Logger.debug('Invalid JWT token: ' + (e as Error).message + ', token: ' + token?.toString() + ', type: ' + typeof token);
            return false;
        }
        return true;
    }

    /**
     * Login with a password
     * @param login the password to login with
     * @returns A JWT token if the password is correct, an error otherwise
     */
    export const login = async (login: { password: string }): Promise<{ token: string, refreshToken: string }> => {
        const userPassword = login.password;

        if (userPassword !== APP_PASSWORD) {
            throw new APIForbiddenError('Invalid password');
        }

        const token = await generateJWTToken('user_id', );
        const refreshToken = await generateJWTToken('user_id',
            60 * 60 * 24 * 90 // 3 months
        )
        
        return { token, refreshToken };
    };
}
