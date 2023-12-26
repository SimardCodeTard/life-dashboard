import { APIForbiddenError, APIInternalServerError } from "@/app/errors/api.error";
import { Logger } from "../logger.service";
import SHA256 from "crypto-js/sha256";

/**
 * Namespace for server-side services to interact with the login API.
 */
export namespace LoginServerService {
    if(process.env.NEXT_PUBLIC_APP_PASSWORD === undefined) throw new APIInternalServerError('Server configuration error: Password is undefined');

    const APP_PASSWORD = 'prout' 
    // SHA256(process.env.NEXT_PUBLIC_APP_PASSWORD).toString();

    const tokens: Array<string> = [];
    const tokenCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    /**
     * Generate a random unique token
     */
    const generateRandomToken = (length: number = 50): string=> {
        let token = '';
        for(let i = 0; i < length; i++) {
            token += tokenCharacters.charAt(Math.floor(Math.random() * tokenCharacters.length));
        }
        if(tokens.includes(token)) {
            Logger.debug('Somehow generated a duplicate token, generating a new one...')
            return generateRandomToken(length);
        }
        return token;
    }

    /**
     * Check if a token is valid
     * @param token The token to check
     * @returns true if the token is valid, false otherwise
     */
    export const isLoggedIn = (token: string): boolean => {
        return tokens.includes(token);
    }

    /**
     * Save a temporary token to the array
     * @param token The token to save
     * @param duration The duration in hours for which the token will be valid, defaults to 24
     */
    const saveTemporaryToken = (token: string, duration: number = 24) => {
        tokens.push(token);
        setTimeout(() => {
            tokens.splice(tokens.indexOf(token), 1);
        }, 1000 * 60 * 60 * duration);
    }

    /**
     * Login with a password
     * @param login the password to login with
     * @returns A temporary token if the password is correct, false otherwise
     */
    export const login = async (login: {password: string}): Promise<{token: string}> => {
        const userPassword = login.password;

        if (userPassword !== APP_PASSWORD) {
            throw new APIForbiddenError('Invalid password');
        }

        const token = generateRandomToken();
        saveTemporaryToken(token);

        return {token};
    };
}