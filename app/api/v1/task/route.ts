import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { handleAPIError } from "@/app/utils/api.utils";

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
export const GET = async () => {
    try {
        const tasks = await serverTasksDataService.findAllTasks();
        return Response.json(tasks);
    } catch (error) {
        return handleAPIError(error as Error);
    }
};