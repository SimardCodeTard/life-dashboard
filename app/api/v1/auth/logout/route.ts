import { CookieNamesEnum } from "@/app/enums/cookies.enum";
import { handleAPIError } from "@/app/utils/api.utils"
import { deleteCookie } from "@/app/utils/cookies.utils";

export const GET = async () => {
    try {
        deleteCookie(CookieNamesEnum.AUTH_TOKEN);
        deleteCookie(CookieNamesEnum.REFRESH_TOKEN);
        return Response.json({success: true});
    } catch (err) {
        return handleAPIError(err);
    }
}