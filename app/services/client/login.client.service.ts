import axios from "axios";
import SHA256 from "crypto-js/sha256";

export namespace LoginClientService {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/login';

    let token: string | null = null;

    export const login = async (password: string): Promise<{token: string} | false> => {
        if(password === undefined || password === null) return false;

        const tokenIsValid = token !== null && (await axios.post(apiUrl+'/validate', {token})).data.valid as boolean;
        if(tokenIsValid) return {token} as {token: string};

        const encryptedPassword = 'prout'
        // SHA256(password).toString();

        const res = await axios.post(apiUrl, {password: encryptedPassword}, { 
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(res.status === 403) throw new Error('Invalid password');

        token = (res.data as {token: string}).token;
        if(token === null || token === undefined) return false;

        return {token};
    }
}