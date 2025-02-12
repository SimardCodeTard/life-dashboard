import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { Task } from "@/app/types/task.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

/**
 * Handles the PUT request to update a task.
 * 
 * @param req - The incoming Next.js request object.
 * @returns A promise that resolves to a Response object.
 */
export const PUT = async (req: NextRequest): Promise<Response> => {
  try {
    // Parse the request body to get the task data
    const task: Task = await parseBody<Task>(req);
    
    // Update the task using the serverTasksDataService
    await serverTasksDataService.updateTask(task);
    
    // Return a success response
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    // Handle any errors that occur during the process
    return handleAPIError(error as Error);
  }
};