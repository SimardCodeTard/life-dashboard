import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { FavoritesDeleteResponseType } from "@/app/types/api.type";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

/**
 * DELETE handler for deleting a task by its ID.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response indicating success or failure.
 */

const deleteHandler = (req: NextRequest): Promise<FavoritesDeleteResponseType> => {
    // Extract the task ID from the request URL parameters
    const taskId = new ObjectId(getUrlParam(req, 'id'));
            
    // Delete the task using the serverTasksDataService

    return serverTasksDataService.deleteTaskById(taskId);
}

export const DELETE = async (req: NextRequest): Promise<Response> => {
    try {
        return Response.json(deleteHandler(req));
    } catch (err) {
        return handleAPIError(err);
    }
}