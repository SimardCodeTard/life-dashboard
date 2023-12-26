import { LoginServerService } from "@/app/services/server/login.server.service";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

export const POST = (request: Request) => parseBody<{password: string}>(request).then(LoginServerService.login)
    .then(Response.json).catch(handleAPIError);