import { APIResponseStatuses } from "@/app/enums/api-response-statuses.enum";
import axios from "axios";
import bcrypt from 'bcrypt';

export namespace clientLoginService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/auth';

    let token: string | null = null;

    export const login = async (password: string): Promise<{token: string} | false> => {
        if(password === undefined || password === null) return false;

        const tokenIsValid = token !== null && (await axios.post(apiUrl+'/validate', {token})).data.valid as boolean;
        if(tokenIsValid) return {token} as {token: string};

        const encryptedPassword = bcrypt.hashSync(password, 10);

        const res = await axios.post(apiUrl, {password: encryptedPassword}, { 
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(res.status === APIResponseStatuses.FORBIDDEN) throw new Error('Invalid password');

        token = (res.data as {token: string})?.token;
        if(token === null || token === undefined) return false;

        return {token};
    }
}