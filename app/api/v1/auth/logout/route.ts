import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { handleAPIError } from "@/app/utils/api.utils"
import { deleteCookie } from "@/app/utils/cookies.utils";

export const GET = async () => {
    try {
        await deleteCookie(CookieNamesEnum.AUTH_TOKEN);
        await deleteCookie(CookieNamesEnum.REFRESH_TOKEN);
        return Response.json({success: true});
    } catch (err) {
        return handleAPIError(err);
    }
}