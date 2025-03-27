'use client';;
import axios from "axios";
import { Logger } from "../logger.service";
import Cookies from 'js-cookie';
import { UserTypeClient, UserTypeServer } from "@/app/types/user.type";
import { AuthLoginRequestBodyType, AuthLoginResponseType, AuthRegisterResponseType, AuthValidateRequestBodyType, AuthValidateResponseType } from "@/app/types/api.type";
import { removeUserFromLocalStorage, setUserInLocalStorage } from "@/app/utils/localstorage.utils";
import { CookieNamesEnum } from "@/app/enums/cookies.enum";

export namespace clientLoginService {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/auth';

    export let authToken: string;

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
    const validateTokens = async (body: AuthValidateRequestBodyType): Promise<{result: boolean, user?: UserTypeClient}> => {
        // Check if token or refreshToken is defined
        if (!checkToken(body.token) && !checkToken(body.refreshToken)) {
            // None are defined, no need to call the API
            return {result: false};
        }

        // Call to auth/validate
        const {valid, token: newToken, user} = (await axios.post<AuthValidateResponseType>(apiUrl + '/validate', body)).data;

        if (valid === true && typeof newToken !== 'string') {
            // If the token was valid
            return {result: true, user: user};
        } else if (valid && typeof newToken === 'string') {
            // If the token was invalid but the refresh token was valid
            // Save the new token
            saveToken(newToken);
            return {result: true, user: user};
        }

        // If none of the tokens were valid
        return {result: false};
    };

    /**
     * Save the token and refresh token (if defined) in cookies, save the user to local sotrage
     * @param token The auth token
     * @param user The user object
     * @param refreshToken The auth refresh token
     */
    const saveLoginResults = (token: string, user: UserTypeClient, refreshToken?: string): void => {
        // Save the token as a cookie
        saveToken(token);
        // Save the refresh token as a cookie if defined
        refreshToken && saveRefreshToken(refreshToken);
        // Save ther user in session storage
        setUserInLocalStorage(user);
    }

    /**
     * Logs in the user using the provided password and tokens.
     * @param password - The user's password.
     * @param token - The user's token.
     * @param refreshToken - The user's refresh token.
     * @returns {Promise<{token: string, refreshToken: string}>} - The new tokens.
     */
    export const login = async (body: AuthLoginRequestBodyType): Promise<UserTypeClient> => {
        // Post to /auth/login
        const res = await axios.post<AuthLoginResponseType>(apiUrl + '/login', body, { headers: { 'Content-Type': 'application/json' } });
        saveLoginResults(res.data.token, res.data.user, res.data.refreshToken);

        return res.data.user;
    };

    export const register = async (body: UserTypeServer): Promise<UserTypeClient> => {
        // Post to /auth/regiser
        const res = await axios.post<AuthRegisterResponseType>(apiUrl + '/register', body);
        saveLoginResults(res.data.token, res.data.user, res.data.refreshToken);

        return res.data.user;
    }

    /**
     * Automatically authenticate the user using stored tokens.
     * @returns {Promise<boolean>} - Returns true if authentication is successful, otherwise false.
     */
    export const autoAuth = async (user: UserTypeClient): Promise<{result: boolean, user?: UserTypeClient}> => {
        try {
            // Retrieve tokens from cookies
            const token = Cookies.get(CookieNamesEnum.TOKEN);
            const refreshToken = Cookies.get(CookieNamesEnum.REFRESH_TOKEN);

            // Attempt to login using the retrieved tokens
            return validateTokens({mail: user.mail, token, refreshToken});
        } catch (e) {
            Logger.debug('Automatic login failed, an error occurred');
            Logger.error(e as Error);
            return {result: false};
        }
    };

    /**
     * Logs out the user.
     * Deletes the tokens cookies and removes the user from local storage.
     */
    export const logout = (): void => {
        // Delete the token cookie
        deleteTokenCookie();
        // Delete the refresh token cookie
        deleteRefreshTokenCookie();
        // Remove the user from session storage
        removeUserFromLocalStorage();

        window.location.replace('/login')
    }

    /**
     * Saves the token in cookies.
     * @param token - The token to save.
     * @param expires - The expiration time in days.
     */
    const saveToken = (token: string, expires: number = 1): void => {
        Cookies.set(CookieNamesEnum.TOKEN, token, { expires, secure: true, sameSite: 'strict'});
    };

    /**
     * Saves the refresh token in cookies.
     * @param refreshToken - The refresh token to save.
     * @param expires - The expiration time in days.
     */
    const saveRefreshToken = (refreshToken: string, expires: number = 90): void => {
        Cookies.set(CookieNamesEnum.REFRESH_TOKEN, refreshToken, { expires, secure: true, sameSite: 'strict'});
    };

    /**
     * Deletes the token cookie.
     */
    const deleteTokenCookie = (): void => Cookies.remove(CookieNamesEnum.TOKEN, {secure: true, sameSite: 'strict'});

    /**
     * Deletes the refresh token cookie.
     */
    const deleteRefreshTokenCookie = (): void => Cookies.remove(CookieNamesEnum.REFRESH_TOKEN, {secure: true, sameSite: 'strict'});
}
