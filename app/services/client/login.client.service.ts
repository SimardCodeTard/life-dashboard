'use client';;
import { Logger } from "../logger.service";
import Cookies from 'js-cookie';
import { UserTypeClient } from "@/app/types/user.type";
import { AuthLoginRequestBodyType, AuthLoginResponseType, AuthRegisterRequestBodyType, AuthRegisterResponseType, AuthValidateResponseType } from "@/app/types/api.type";
import { removeUserFromLocalStorage, setUserInLocalStorage } from "@/app/utils/localstorage.utils";
import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { axiosClientService } from "./axios.client.service";

export namespace clientLoginService {

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
    const validateTokens = async (): Promise<{result: boolean, user: UserTypeClient}> => {
        // Call to auth/validate
        const {user} = (await axiosClientService.GET<AuthValidateResponseType>(apiUrl + '/validate')).data;
        return {result: true, user: user};
    };

    /**
     * Logs in the user using the provided password and tokens.
     * @param password - The user's password.
     * @param token - The user's token.
     * @param refreshToken - The user's refresh token.
     * @returns {Promise<{token: string, refreshToken: string}>} - The new tokens.
     */
    export const login = async (body: AuthLoginRequestBodyType): Promise<UserTypeClient> => {
        // Post to /auth/login
        const res = await axiosClientService.POST<AuthLoginResponseType, AuthLoginRequestBodyType>(apiUrl + '/login', body, { headers: { 'Content-Type': 'application/json' } });
        setUserInLocalStorage(res.data.user);

        return res.data.user;
    };

    export const register = async (body: AuthRegisterRequestBodyType): Promise<UserTypeClient> => {
        // Post to /auth/regiser
        const res = await axiosClientService.POST<AuthRegisterResponseType, AuthRegisterRequestBodyType>(apiUrl + '/register', body);
        setUserInLocalStorage(res.data.user);

        return res.data.user;
    }

    /**
     * Automatically authenticate the user using stored tokens.
     * @returns {Promise<boolean>} - Returns true if authentication is successful, otherwise false.
     */
    export const autoAuth = async (): Promise<{result: boolean, user?: UserTypeClient}> => {
        try {
            // Attempt to login using the retrieved tokens
            return await validateTokens();
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
    }

    /**
     * Saves the token in cookies.
     * @param token - The token to save.
     * @param expires - The expiration time in days.
     */
    const saveToken = (token: string, expires: number = 1): void => {
        Cookies.set(CookieNamesEnum.AUTH_TOKEN, token, { expires, secure: true, sameSite: 'strict'});
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
    const deleteTokenCookie = (): void => Cookies.remove(CookieNamesEnum.AUTH_TOKEN, {secure: true, sameSite: 'strict'});

    /**
     * Deletes the refresh token cookie.
     */
    const deleteRefreshTokenCookie = (): void => Cookies.remove(CookieNamesEnum.REFRESH_TOKEN, {secure: true, sameSite: 'strict'});
}
