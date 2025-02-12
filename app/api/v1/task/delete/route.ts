import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

/**
 * DELETE handler for deleting a task by its ID.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response indicating success or failure.
 */
export const DELETE = async (req: NextRequest): Promise<Response> => {
    try {
        // Extract the task ID from the request URL parameters
        const taskId = new ObjectId(getUrlParam(req, 'id'));
        
        // Delete the task using the serverTasksDataService
        await serverTasksDataService.deleteTaskById(taskId);
        
        // Return a success response
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        // Handle any errors that occur during the deletion process
        return handleAPIError(error as Error);
    }
};