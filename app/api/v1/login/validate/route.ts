import { LoginServerService } from "@/app/services/server/login.server.service";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

export const POST = (request: Request) => parseBody<{password: string}>(request).then(body => body.password)
    .then(LoginServerService.isLoggedIn).then(valid => {valid}).then(Response.json).catch(handleAPIError); 