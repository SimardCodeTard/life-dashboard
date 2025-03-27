import { APIBadRequestError, APINotFoundError } from "@/app/errors/api.error";
import { Logger } from "@/app/services/logger.service";
import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { TaskTypeDto } from "@/app/types/task.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";

const getHandler = async (params: Promise<{id: string}>): Promise<TaskTypeDto | null> => {
    const id = (await params).id;

    if(!id) {
        throw new APIBadRequestError('Missing or invalid params');
    }

    const task = await serverTasksDataService.findTaskById(new ObjectId(id));

    if(task === null) {
        throw new APINotFoundError('Task not found')
    }

    Logger.debug(`Fetched task by id ${id}, responding with : ${JSON.stringify(task)}`);

    return task;
}

export const GET = async (_: Request, {params}: {params: Promise<{id: string}>}): Promise<Response> => {
    try {
        return Response.json(await getHandler(params));
    } catch (err) { 
        return handleAPIError(err);
    }
}