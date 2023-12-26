'use client'

import { LoginClientService } from "@/app/services/client/login.client.service";
import { FormEvent } from "react"

export default function PWDForm() {


    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const password = (e.target as any)[0].value; 
        (e.target as any)[0].value = '';
        console.log(password)
        LoginClientService.login(password)
        .then((res: {token: string} | false) => {
            if (res !== false) {
                // Save the token in a cookie
                document.cookie = `token=${res.token}`;
                // Redirect to the dashboard
                window.location.href = '/dashboard';
            } else {
                throw new Error('')
            }
        })
        .catch(() => console.log('failed to login'));
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col space-y-4 bg-[var(--card-background)] p-3 rounded-md shadow-md">
            <input autoFocus className="rounded-sm bg-[rgba(255,255,255,0.2)] backdrop-blur-xl border-white/20-1" type="password" />
            <button type="submit" className="bg-[rgba(255,255,255,0.2)] rounded-sm hover:bg-[rgba(255,255,255,0.4)]">Login</button>
        </form>
    )
}