'use client'
import { APIResponseStatuses } from "@/app/enums/api-response-statuses.enum";
import axios, { AxiosResponse } from "axios";
import { Logger } from "../logger.service";
import Cookies from 'js-cookie';

export namespace clientLoginService {

    export let authToken: string;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/auth';

    /**
     * Checks if a token is valid (not null or undefined).
     * @param token - The token to check.
     * @returns {boolean} - True if the token is valid, otherwise false.
     */
    const checkToken = (token?: string | null): boolean => {
        return token !== undefined && token !== null;
    };

    /**
     * Validates the provided tokens with the server.
     * @param token - The token to validate.
     * @param refreshToken - The refresh token to validate.
     * @returns {Promise<boolean>} - True if tokens are valid, otherwise false.
     */
    const validateTokens = async (token: string | null | undefined, refreshToken: string | null | undefined): Promise<boolean> => {
        if (!checkToken(token) && !checkToken(refreshToken)) {
            return false;
        }

        const validateRes = await axios.post(apiUrl + '/validate', { token, refreshToken });

        if (validateRes.data === true) {
            // If the token was valid
            return true;
        } else if (typeof validateRes.data.token === 'string') {
            // If the token was invalid but the refresh token was valid
            saveToken(validateRes.data.token);
            return true;
        }

        // If none of the tokens were valid
        return false;
    };

    /**
     * Checks if a password is valid (not empty, null, or undefined).
     * @param password - The password to check.
     * @returns {Promise<boolean>} - True if the password is valid, otherwise false.
     */
    const checkPassword = async (password?: string | null): Promise<boolean> => {
        return password !== '' && password !== undefined && password !== null;
    };

    /**
     * Logs in the user using the provided password and tokens.
     * @param password - The user's password.
     * @param token - The user's token.
     * @param refreshToken - The user's refresh token.
     * @returns {Promise<{token: string, refreshToken: string}>} - The new tokens.
     */
    export const login = async (password: string, token: string | undefined, refreshToken: string | undefined): Promise<{ token: string, refreshToken: string }> => {
        if (await validateTokens(token, refreshToken)) {
            if (!token) token = Cookies.get('token');
            return {
                token: token as string,
                refreshToken: refreshToken as string
            };
        } else {
            if (!await checkPassword(password)) {
                throw new Error('Invalid password');
            }
            return getTokens(password);
        }
    };

    /**
     * Retrieves new tokens from the server using the provided password.
     * @param password - The user's password.
     * @returns {Promise<{token: string, refreshToken: string}>} - The new tokens.
     */
    const getTokens = (password: string): Promise<{ token: string, refreshToken: string }> => {
        return axios.post<{ token: string, refreshToken: string }>(apiUrl, { password }, { headers: { 'Content-Type': 'application/json' } })
            .then((res: AxiosResponse) => {
                if (res.status === APIResponseStatuses.FORBIDDEN) {
                    throw new Error('Invalid password');
                } else {
                    return {
                        token: res.data.token,
                        refreshToken: res.data.refreshToken
                    };
                }
            });
    };

    /**
     * Automatically authenticate the user using stored tokens.
     * @returns {Promise<boolean>} - Returns true if authentication is successful, otherwise false.
     */
    export const autoAuth = async (): Promise<boolean> => {
        try {
            // Retrieve tokens from cookies
            const token = Cookies.get('token');
            const refreshToken = Cookies.get('refresh-token');

            // Attempt to login using the retrieved tokens
            const res = await login('', token, refreshToken);

            Logger.debug(JSON.stringify(res));

            // Check if both tokens are present in the response
            if (res.token && res.refreshToken) {
                // Save the new tokens in cookies
                saveToken(res.token);
                saveRefreshToken(res.refreshToken);
                Logger.debug('Automatic login success');
                return true;
            } else {
                Logger.debug('Automatic login failed');
                return false;
            }
        } catch (e) {
            Logger.debug('Automatic login failed, an error occurred');
            Logger.error(e as Error);
            return false;
        }
    };

    /**
     * Saves the token in cookies.
     * @param token - The token to save.
     * @param expires - The expiration time in days.
     */
    const saveToken = (token: string, expires: number = 1): void => {
        Cookies.set('token', token, { expires, secure: true }); // TODO: HTTP ONLY
    };

    /**
     * Saves the refresh token in cookies.
     * @param refreshToken - The refresh token to save.
     * @param expires - The expiration time in days.
     */
    const saveRefreshToken = (refreshToken: string, expires: number = 90): void => {
        Cookies.set('refresh-token', refreshToken, { expires, secure: true }); // TODO: HTTP ONLY
    };
}
