import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { TaskUpdateRequestBodyType, TaskUpdateResponseType } from "@/app/types/api.type";
import { TaskTypeDto } from "@/app/types/task.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Handles the PUT request to update a task.
 * 
 * @param req - The incoming Next.js request object.
 * @returns A promise that resolves to a Response object.
 */

const putHandler = async (req: Request): Promise<TaskUpdateResponseType> => {
  // Parse the request body to get the task data
  const task: TaskTypeDto = await parseBody<TaskUpdateRequestBodyType>(req);
      
  // Update the task using the serverTasksDataService
  return serverTasksDataService.updateTask(task);
}

export const PUT = async (req: Request): Promise<Response> => Response.json(await putHandler(req).catch(handleAPIError));