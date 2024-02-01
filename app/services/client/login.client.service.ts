import { APIResponseStatuses } from "@/app/enums/api-response-statuses.enum";
import axios, { AxiosResponse } from "axios";

export namespace clientLoginService {
    export let authToken: string;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/auth';

    const checkToken = (token?: string | null) => token !== undefined && token !== null;

    const validateToken = (token?: string | null) => checkToken(token) ? axios.post(apiUrl+'/validate', {token}).then(res => res.data.valid  as boolean) : false;

    const checkPassword = async (password?: string | null) => password !== undefined && password !== null;

    export const login = async (password: string, token?: string): Promise<{token: string}> => {  
        return checkPassword(password)
            .then((passwordIsOk: boolean) => passwordIsOk ? token : (() => {throw new Error('Invalid password')})())
            .then(validateToken)
            .then((tokenValid: boolean) => tokenValid ? {token: token as string} : getToken(password))
    }

    const getToken = async (password: string): Promise<{token: string}> => {
        return await axios.post<{ token: string }>(apiUrl, {password}, { headers: {'Content-Type': 'application/json'} })
        .then((res: AxiosResponse) => {
            if(res.status === APIResponseStatuses.FORBIDDEN) {
                throw new Error('Invalid password');
            } else {
                return {token: res.data.token};
            }
        });
    }
}
