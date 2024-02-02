'use client'

import { clientLoginService } from "@/app/services/client/login.client.service";
import { FormEvent } from "react"
import Cookies from 'js-cookie';
import { Logger } from "@/app/services/logger.service";

export default function PWDForm() {


    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const password = (e.target as any)[0].value; 
        (e.target as any)[0].value = '';
        clientLoginService.login(password)
        .then((res: {token: string} | false) => {
            if (res !== false) {
                Logger.debug('Login successful');
                // Save the token in a cookie
                Cookies.set('token', res.token, { expires: 1 });
                // Redirect to the dashboard
                window.location.href = '/dashboard';
            } else {
                Logger.debug('Login failed');
                throw new Error('')
            }
        })
        .catch(() => Logger.error('Failed to login'));
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col space-y-4 bg-[var(--card-background)] p-3 rounded-md shadow-md">
            <input autoFocus className="rounded-sm bg-[rgba(255,255,255,0.2)] backdrop-blur-xl border-white/20-1" type="password" />
            <button type="submit" className="bg-[rgba(255,255,255,0.2)] rounded-sm hover:bg-[rgba(255,255,255,0.4)]">Login</button>
        </form>
    )
}