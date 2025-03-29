import { serverUserDataService } from "@/app/services/server/user-data.server.service";
import { UserPutRequestBodyType, UserPutResponseTye } from "@/app/types/api.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

const putHandler = async (req: Request): Promise<UserPutResponseTye> => {
    const body = await parseBody<UserPutRequestBodyType>(req);

    return serverUserDataService.updateUser(body);
}

export const PUT = async (req: Request): Promise<Response> => {
    try {
        return Response.json(await putHandler(req));
    } catch (err) { 
        return handleAPIError(err);
    }
}

