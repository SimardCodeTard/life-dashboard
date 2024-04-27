import { serverLoginService } from "@/app/services/server/login.server.service";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

export const POST = (request: Request) => parseBody<{ token: string, refreshToken: string }>(request)
    .then(serverLoginService.validateTokenOrRefreshToken).then(Response.json).catch(handleAPIError); 