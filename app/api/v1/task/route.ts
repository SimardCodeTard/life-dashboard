import { APIBadRequestError } from "@/app/errors/api.error";
import { Logger } from "@/app/services/logger.service";
import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { TaskResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

/**
 * This file defines the API route for fetching all tasks.
 * The route is dynamic and forces revalidation on each request.
 */

export const dynamic = 'force-dynamic';

/**
 * GET handler for fetching all tasks.
 * Utilizes the serverTasksDataService to retrieve tasks and handles any potential errors.
 * 
 * @returns {Promise<Response>} A promise that resolves to a JSON response containing all tasks.
 */
const getHandler = async (req: NextRequest): Promise<TaskResponseType> => {
    const userId = req.nextUrl.searchParams.get('userId');

    if(userId === null) {
        throw new APIBadRequestError('Missing required query parameters.');
    }

    const tasks = await serverTasksDataService.findAllTasks(userId);

    Logger.debug(`Fetched all tasks with userId${userId}, responding with : ${JSON.stringify(tasks)}`)

    return tasks;
}

export const GET = async (req: NextRequest): Promise<Response> => Response.json(await getHandler(req).catch(handleAPIError));