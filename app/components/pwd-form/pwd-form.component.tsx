'use client'

import { clientLoginService } from "@/app/services/client/login.client.service";
import { FormEvent, useEffect, useState } from "react"
import Cookies from 'js-cookie';
import { Logger } from "@/app/services/logger.service";

export default function PWDForm() {

    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false); 


    const onSubmit = (e: FormEvent) => {
        const savedPasswordEncrypted = localStorage.getItem('pwd');
        const savedPassword = savedPasswordEncrypted ? new TextDecoder().decode(new Uint8Array(Buffer.from(savedPasswordEncrypted, 'hex'))) : '';
        if(savedPassword === '') {
            e.preventDefault();
            const password = (e.target as any)[0].value; 
            (e.target as any)[0].value = '';
            setIsLoggingIn(true);
            clientLoginService.login(password)
            .then((res) => {
                Logger.debug('Login successful');
                // Save the token in a cookie
                Cookies.set('token', res.token, { expires: 1 });

                // Save the password in the local storage
                localStorage.setItem('pwd', password);

                setIsLoggingIn(false);

                // Redirect to the dashboard
                window.location.href = '/dashboard';
            }).catch(() => {
                setIsLoggingIn(false);
                setPasswordInvalid(true);
                Logger.debug('Login failed');
            })
        }
    }

    useEffect(() => {
        clientLoginService.automaticallyAuthenticate();
    })

    return (
        <>
            <form onSubmit={onSubmit} className="flex flex-col space-y-4 bg-[var(--card-background)] p-3 rounded-md shadow-md">
                <input autoFocus className="rounded-sm bg-[rgba(255,255,255,0.2)] backdrop-blur-xl border-white/20-1" type="password" />
                <button type="submit" className="bg-[rgba(255,255,255,0.2)] rounded-sm hover:bg-[rgba(255,255,255,0.4)]" 
                disabled={isLoggingIn as boolean}>Login</button>
            </form>
            {passwordInvalid && <p className="text-red-500">Invalid password</p>}
        </>
    )
}