import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { handleAPIError } from "@/app/utils/api.utils"
import { deleteCookie } from "@/app/utils/cookies.utils";
import { cookies } from "next/headers";

export const GET = async () => {
    try {
        (await cookies()).getAll().forEach(cookie => {
            if(cookie.name.startsWith(CookieNamesEnum.AUTH_TOKEN) || cookie.name.startsWith(CookieNamesEnum.REFRESH_TOKEN)) {
                deleteCookie(cookie.name);
            }
        })
        return Response.json({success: true});
    } catch(err) {
        return handleAPIError(err);
    }
}