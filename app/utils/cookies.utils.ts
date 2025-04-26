import { cookies } from "next/headers";
import { CookieNamesEnum } from "../enums/cookies.enum";

export const AUTH_TOKEN_LIFETIME = 60 * 60 * 24; // 1 day
export const AUTH_REFRESH_TOKEN_LIFETIME = 60 * 60 * 24 * 30; // 1 month

export const setAuthTokenCookie = async (token: string, name: string = CookieNamesEnum.AUTH_TOKEN) => {
    (await cookies()).set(name, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "strict",
        path: "/",
        maxAge: AUTH_TOKEN_LIFETIME,
    });
}

export const setAuthRefreshTokenCookie = async (refreshToken: string, name: string = CookieNamesEnum.REFRESH_TOKEN) => {
    (await cookies()).set(name, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "strict",
        path: "/",
        maxAge: AUTH_REFRESH_TOKEN_LIFETIME,
    });
}

export const deleteCookie = async (name: string) => {
    (await cookies()).delete(name);
}

export const getCookie = async (name: string) => (await cookies()).get(name);

export const getInactiveUserAuthTokenName = (userId: string) => `${CookieNamesEnum.AUTH_TOKEN}${userId}`;
export const getInactiveUserAuthRefreshTokenName = (userId: string) => `${CookieNamesEnum.REFRESH_TOKEN}${userId}`;