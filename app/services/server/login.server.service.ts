import { APIForbiddenError, APIInternalServerError, APINotFoundError, APIUnauthorizedError } from '@/app/errors/api.error';
import { Logger } from '../logger.service';
import { SignJWT, jwtVerify } from 'jose';
import { UserTypeClient, UserTypeServer } from '@/app/types/user.type';
import { ObjectId } from 'mongodb';
import { serverUserDataService } from './user-data.server.service';
import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';

/**
 * Namespace for server-side services to interact with the login API.
 */
export namespace serverLoginService {
    // Ensure required environment variables are defined
    if (!process.env.JWT_SECRET) {
        throw new APIInternalServerError('Server configuration error: Missing JWT secret.');
    }
    
    const JWT_SECRET = process.env.JWT_SECRET;

    /**
     * Generate a JWT token
     * @param userId The user ID to include in the token payload
     * @param role The user's role
     * @param lifetime The token lifetime in seconds (default: 1 day)
     * @returns A promise that resolves to the generated JWT token
     */
    export const generateJWTToken = (
        userId: string,
        role: string,
        lifetime = 60 * 60 * 24 // one day
    ): Promise<string> => {
        const iat = Math.floor(DateTime.now().toSeconds()); // Issued at time
        const exp = iat + lifetime;
        const jti = crypto.randomUUID(); // Unique identifier for token

        return new SignJWT({ userId, role, jti })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(new TextEncoder().encode(JWT_SECRET));
    }

    /**
     * Validate a token or refresh it if invalid
     * @param token The JWT token
     * @param refreshToken The refresh token
     * @param user The authenticated user object
     * @returns A promise resolving to an object indicating if the token is valid and optionally returning a new token
     */
    export const validateTokenOrRefreshToken = async ({
        token,
        refreshToken,
        user
    }: { token?: string; refreshToken?: string; user: UserTypeServer }): Promise<{ valid: boolean; token?: string }> => {
        // TODO; check if user still exsists (token has a userId in payload)
        try {
            if (!token) throw new Error('No token provided');
            await jwtVerify(token, new TextEncoder().encode(JWT_SECRET)); // Verifies token with JWT Secret
        } catch (e) {
            Logger.debug('Invalid JWT token: ' + token);
            Logger.error(e as Error);

            try {
                if (!refreshToken) throw new APIUnauthorizedError('No token or refresh token provided');
                await jwtVerify(refreshToken, new TextEncoder().encode(JWT_SECRET));
                const newToken = await generateJWTToken((user._id as ObjectId).toString(), user.role);
                return { valid: false, token: newToken };
            } catch (e) {
                Logger.debug('Invalid refresh token: ' + refreshToken);
                Logger.error(e as Error);
                throw new APIUnauthorizedError('Provided an invalid refresh token');
            }
        }
        return { valid: true };
    };

    /**
     * Check if a JWT token is valid
     * @param token The token to check
     * @returns true if the token is valid, false otherwise
     */
    export const isLoggedIn = async (token?: string): Promise<boolean> => {
        try {
            if (!token) throw new APIUnauthorizedError('No token provided');
            await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        } catch (e) {
            Logger.debug('Invalid JWT token: ' + (e as Error).message);
            return false;
        }
        return true;
    };

    /**
     * Login with a password
     * @param login The email and password of the user
     * @param generateRefreshToken Whether to generate a refresh token
     * @returns A promise resolving to an object containing the access and refresh tokens
     */
    export const login = async (
        login: { mail: string; password: string; keepLoggedIn: boolean },
    ): Promise<{ token: string; refreshToken?: string, user: UserTypeClient }> => {
        const user = await serverUserDataService.findUserByMail(login.mail.toLowerCase());

        if (!user) {
            throw new APINotFoundError('User not found');
        }

        if (!bcrypt.compareSync(login.password, user.password)) {
            throw new APIForbiddenError('Invalid credentials.');
        }

        const clientUser: UserTypeClient = serverUserDataService.mapServerUserToClientUser(user);

        const token = await generateJWTToken((user._id as ObjectId).toString(), user.role);
        let refreshToken: string | undefined;

        if (login.keepLoggedIn) {
            refreshToken = await generateJWTToken((user._id as ObjectId).toString(), user.role, 60 * 60 * 24 * 30); // 1 month
        }

        return { token, refreshToken, user: clientUser };
    };
}
