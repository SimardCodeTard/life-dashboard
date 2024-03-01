'use client'

import { clientLoginService } from "@/app/services/client/login.client.service";
import { FormEvent, useEffect } from "react"
import Cookies from 'js-cookie';
import { Logger } from "@/app/services/logger.service";
import { PWDFormPropsType } from "@/app/types/login.type";

export default function PWDForm({ setPasswordInvalid, setIsLoggingIn }: PWDFormPropsType) {


    const onSubmit = (e: FormEvent) => {
        const savedPasswordEncrypted = localStorage.getItem('pwd');
        const savedPassword = savedPasswordEncrypted ? new TextDecoder().decode(new Uint8Array(Buffer.from(savedPasswordEncrypted, 'hex'))) : '';
        if(savedPassword === '') {
            e.preventDefault();
            const password = (e.target as any)[0].value; 
            (e.target as any)[0].value = '';
            setIsLoggingIn(true);
            clientLoginService.login(password)
            .then((res: {token: string} | false) => {
                if (res !== false) {
                    Logger.debug('Login successful');
                    // Save the token in a cookie
                    Cookies.set('token', res.token, { expires: 1 });

                    // Save the password in the local storage
                    localStorage.setItem('pwd', password);

                    // Redirect to the dashboard
                    window.location.href = '/dashboard';
                } else {
                    Logger.debug('Login failed');
                    setPasswordInvalid(true);
                }
                setIsLoggingIn(false);
            })
        }
    }

    useEffect(() => {
        const savedPassword = localStorage.getItem('pwd');
        if(savedPassword !== '' && savedPassword !== null) {
            setIsLoggingIn(true);
            clientLoginService.login(savedPassword)
            .then((res: {token: string} | false) => {
                if(res !== false) {
                    Logger.debug('Login successful');

                    // Save the token in a cookie
                    Cookies.set('token', res.token, { expires: 1 });

                    setIsLoggingIn(false);
                    // Redirect to the dashboard
                    window.location.href = '/dashboard';
                }
            })
        }        
    }, [])

    return (
        <form onSubmit={onSubmit} className="flex flex-col space-y-4 bg-[var(--card-background)] p-3 rounded-md shadow-md">
            <input autoFocus className="rounded-sm bg-[rgba(255,255,255,0.2)] backdrop-blur-xl border-white/20-1" type="password" />
            <button type="submit" className="bg-[rgba(255,255,255,0.2)] rounded-sm hover:bg-[rgba(255,255,255,0.4)]">Login</button>
        </form>
    )
}