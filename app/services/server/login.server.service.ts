import { APIForbiddenError, APIInternalServerError, APINotFoundError, APIUnauthorizedError } from '@/app/errors/api.error';
import { Logger } from '../logger.service';
import { SignJWT, jwtDecrypt, jwtVerify } from 'jose';
import { UserTypeClient, UserTypeServer } from '@/app/types/user.type';
import { ObjectId } from 'mongodb';
import { serverUserDataService } from './user-data.server.service';
import bcrypt from 'bcrypt';
import { DateTime } from 'luxon';
import { tokenDataService } from './tokens-data.server.service';
import { TokenType } from '@/app/types/token.type';

/**
 * Namespace for server-side services to interact with the login API.
 */
export namespace serverLoginService {
    if (!process.env.JWT_SECRET) {
        throw new APIInternalServerError('Server configuration error: Missing JWT secret.');
    }
    
    const JWT_SECRET = process.env.JWT_SECRET;

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

    const saveRefreshToken = async (userId: string, token: string, userIp: string) => {
        return await tokenDataService.saveRefreshToken(userId, token, userIp);
    };

    const isRefreshTokenValid = async (token: string): Promise<TokenType | null> => {
        return await tokenDataService.findRefreshToken(token);
    };

    const revokeRefreshToken = async (token: string) => {
        return await tokenDataService.deleteRefreshToken(token);
    };

    export const generateJWTToken = (userId: string, role: string, lifetime = 60 * 60 /* 1 hour */): Promise<string> => {
        const iat = Math.floor(DateTime.now().toSeconds());
        const exp = iat + lifetime;
        const jti = crypto.randomUUID();

        return new SignJWT({ userId, role, jti })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .setNotBefore(iat)
            .sign(new TextEncoder().encode(JWT_SECRET));
    };

    export const validateTokenOrRefreshToken = async (token:string, userIp: string, clientIp: string, refreshToken?: string) => {
        let user: UserTypeServer;
        try {
            if (!token) throw new Error('No token provided');

            const userId = (await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))).payload.userId as string;
            const found = await serverUserDataService.findUserById(new ObjectId(userId));
            
            if(found === null) {
                throw new APINotFoundError('User not found');
            }
            
            user = found;
        } catch (e) {
            Logger.debug('Invalid JWT token');
            
            if (!refreshToken) {
                throw new APIUnauthorizedError('No token or refresh token provided');
            }

            const refreshTokenFound = await isRefreshTokenValid(refreshToken);

            if(!refreshTokenFound || refreshTokenFound.userId !== clientIp) {
                throw new APIUnauthorizedError('Invalid refresh token');
            }

            let userId: string;
            try {
                userId = (await jwtVerify(refreshToken, new TextEncoder().encode(JWT_SECRET))).payload.userId as string;
            } catch (err) {
                Logger.error(err as Error);
                throw new APIUnauthorizedError('Invalid refresh token')
            }

            await revokeRefreshToken(refreshToken);

            const user = await serverUserDataService.findUserById(new ObjectId(userId));

            if(user === null) {
                throw new APINotFoundError('User not found')
            }

            const newToken = await generateJWTToken((user._id as ObjectId).toString(), user.role);
            const newRefreshToken = await generateJWTToken((user._id as ObjectId).toString(), user.role, 60 * 60 * 24 * 30 /* 1 month */);
            
            await saveRefreshToken((user._id as ObjectId).toString(), newRefreshToken, userIp);
            
            return { valid: false, token: newToken, refreshToken: newRefreshToken, user: serverUserDataService.mapServerUserToClientUser(user) };
        }
        return { valid: true, user };
    };

    export const login = async (mail: string, password: string, keepLoggedIn: boolean, userIp: string) => {
        const user = await serverUserDataService.findUserByMail(mail.toLowerCase());

        if(!user) {
            throw new APINotFoundError('User not found.')
        }

        if (!bcrypt.compareSync(password, user.password)) {
            throw new APIForbiddenError('Invalid credentials.');
        }
        
        const clientUser: UserTypeClient = serverUserDataService.mapServerUserToClientUser(user);
        const token = await generateJWTToken((user._id as ObjectId).toString(), user.role);
        let refreshToken: string | undefined;

        if (keepLoggedIn) {
            refreshToken = await generateJWTToken((user._id as ObjectId).toString(), user.role, 60 * 60 * 24 * 30 /* 1 month */);
            if(!(await saveRefreshToken((user._id as ObjectId).toString(), refreshToken, userIp)).acknowledged) {
                throw new APIInternalServerError('Failed to save new refresh token');
            }
        }
        
        return { token, refreshToken, user: clientUser };
    };

    const decryptToken = async (token: string) => {
        return await jwtDecrypt(token, new TextEncoder().encode(JWT_SECRET));
    }

}