'use client'
import { APIResponseStatuses } from "@/app/enums/api-response-statuses.enum";
import axios, { AxiosResponse } from "axios";
import { Logger } from "../logger.service";
import Cookies from 'js-cookie';

export namespace clientLoginService {

    export let authToken: string;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/auth';

    const checkToken = (token?: string | null) => token !== undefined && token !== null; 

    const validateTokens = async (token: string | null | undefined, refreshToken: string | null | undefined) => {

        if(!checkToken(token) && !checkToken(refreshToken)) {
            return false;
        }

        const validateRes = await axios.post(apiUrl + '/validate', { token, refreshToken });

        if(validateRes.data === true ){
             // If the token was valid
            return true;
        } else if(typeof validateRes.data.token === 'string') {
            // If the token was invalid but the refresh token was
            saveToken(validateRes.data.token);
            return true;
        }

        // If none of the tokens were valid
        return false;
    }

    const checkPassword = async (password?: string | null) => password !== '' && password !== undefined && password !== null;

    export const login = async (password: string, token: string |undefined, refreshToken: string | undefined): Promise<{token: string, refreshToken: string}> => {  
        if(await validateTokens(token, refreshToken)) {
            Logger.debug('Validated tokens')
            if(!token) token = Cookies.get('token');
            return {
                token: token as string,
                refreshToken: refreshToken as string
            };
        } else {
            if(!checkPassword(password)) {
                throw new Error('Invalid password');
            }
            return getTokens(password);
        }
    }

    const getTokens = async (password: string): Promise<{token: string, refreshToken: string}> => {
        return await axios.post<{ 
            token: string,
            refreshToken: string 
        }>(apiUrl, {password}, { headers: {'Content-Type': 'application/json'} })
        .then((res: AxiosResponse) => {
            if(res.status === APIResponseStatuses.FORBIDDEN) {
                throw new Error('Invalid password');
            } else {
                return {
                    token: res.data.token,
                    refreshToken: res.data.refreshToken
                };
            }
        });
    }

    export const autoAuth = async () => {
        const token = Cookies.get('token');
        const refreshToken = Cookies.get('refresh-token')
        return login('', token, refreshToken)
        .then((res: {
                token: string
                refreshToken: string
            }) => {
            Logger.debug(JSON.stringify(res))
            if(res.token && res.refreshToken) {
                saveToken(res.token as string);
                saveRefreshToken(res.refreshToken);
                Logger.debug('Automatic login success');
                return true;
            } else {
                Logger.debug('Automatic login failed');
                return false;
            }
        })
        .catch((e) => {
            Logger.debug('Automatic login failed, an error occured');
            Logger.error(e)
            return false;
        })
    }

    const saveToken = (token: string, expires: number = 1) => {
        Cookies.set('token', token, { expires, secure: true }) // TODO: HTTP ONLY
    }

    const saveRefreshToken = (refreshToken: string, expires: number = 90) => {
        Cookies.set('token', refreshToken, { expires, secure: true }) // TODO: HTTP ONLY
    }
}
