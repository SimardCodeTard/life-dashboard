import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { TaskNewRequestBodyType, TaskNewResponseType } from "@/app/types/api.type";
import { TaskTypeDto } from "@/app/types/task.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

/**
 * Handles the POST request to create a new task.
 * 
 * @param req - The incoming request object
 * @returns A promise that resolves to a Response object
 */

const postHandler = async (req: NextRequest): Promise<TaskNewResponseType> => {
    // Parse the request body to get the task data
    const task: TaskTypeDto = await parseBody<TaskNewRequestBodyType>(req);
      
    // Save the task using the serverTasksDataService
    return serverTasksDataService.saveTask(task);
}

export const POST = async (req: NextRequest): Promise<Response> => {
    try {
        return Response.json(await postHandler(req));
    } catch (err) {
        return handleAPIError(err);
    }
}