'use client';;
import { Logger } from "../logger.service";
import { UserTypeClient } from "@/app/types/user.type";
import { AuthLogoutResponseType, AuthLoginRequestBodyType, AuthLoginResponseType, AuthRegisterRequestBodyType, AuthRegisterResponseType, AuthValidateResponseType, AuthLogoutAllResponseType, AuthAddAccountRequestBodyType, AuthAddAccountResponseType, AuthSwitchAccountResponseType } from "@/app/types/api.type";
import { axiosClientService } from "./axios.client.service";
import { deleteActiveSession, deleteAllSessions, saveSession } from "@/app/utils/indexed-db.utils";
import { removeActiveUserId, setActiveUserId } from "@/app/utils/localstorage.utils";
import { ObjectId } from "mongodb";

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
    export const validateTokens = async (userId?: string): Promise<{result: boolean, user: UserTypeClient}> => {
        // Call to /auth/validate
        let fetchUrl = apiUrl + '/validate';
        if(userId) {
            fetchUrl += '?userId='+userId
        }
        const {user} = (await axiosClientService.GET<AuthValidateResponseType>(fetchUrl)).data;
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
        const res = await axiosClientService.POST<AuthLoginResponseType, AuthLoginRequestBodyType>(apiUrl + '/login', body);
        saveSession(res.data.user._id?.toString() as string, res.data.user);
        setActiveUserId(res.data.user._id as ObjectId);
        return res.data.user;
    };

    export const register = async (body: AuthRegisterRequestBodyType): Promise<UserTypeClient> => {
        // Post to /auth/regiser
        const res = await axiosClientService.POST<AuthRegisterResponseType, AuthRegisterRequestBodyType>(apiUrl + '/register', body);
        saveSession(res.data.user._id?.toString() as string, res.data.user);
        setActiveUserId(res.data.user._id as ObjectId);
        return res.data.user;
    }

    export const addAccount = async (body: AuthAddAccountRequestBodyType, previousActiveUserid: string): Promise<UserTypeClient> => {
        // Post to /auth/add-account
        const res = await axiosClientService.POST<AuthAddAccountResponseType, AuthAddAccountRequestBodyType>(apiUrl + '/add-account?previousActiveUserid='+previousActiveUserid, body);
        saveSession(res.data.user._id?.toString() as string, res.data.user);
        setActiveUserId(res.data.user._id as ObjectId);
        return res.data.user;
    }
    /**
     * Automatically authenticate the user using stored tokens.
     * @returns {Promise<boolean>} - Returns true if authentication is successful, otherwise false.
     */
    export const autoAuth = async (): Promise<{result: boolean, user?: UserTypeClient}> => {
        try {
            // Attempt to login using the retrieved tokens
            const res = await validateTokens();
            saveSession(res.user._id?.toString() as string, res.user);
            setActiveUserId(res.user._id as ObjectId);
            return res;
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
    export const logout = async (): Promise<AuthLogoutResponseType> => {
        const res = await axiosClientService.GET<AuthLogoutResponseType>(apiUrl + '/logout').then(res => res.data);
        deleteActiveSession()
        removeActiveUserId();
        return res
    };

    /**
     * Logs out all users
     * Deletes all the tokens
     */
    export const logoutAll = async (): Promise<AuthLogoutAllResponseType> => {
        const res = await axiosClientService.GET<AuthLogoutAllResponseType>(apiUrl + '/logout/all').then(res => res.data)
        deleteAllSessions();
        removeActiveUserId();
        return res;
    };

    export const switchAccount = async (newUserId: ObjectId | string, previousUserId: ObjectId | string): Promise<AuthSwitchAccountResponseType> => {
        const res = await axiosClientService.GET<AuthSwitchAccountResponseType>(apiUrl + `/switch-account?userId=${newUserId.toString()}&previousUserId=${previousUserId.toString()}`).then(res => res.data);
        setActiveUserId(newUserId);
        return res;
    }
}
