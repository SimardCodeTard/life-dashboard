import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { Task } from "@/app/types/task.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

export const PUT = (req: NextRequest): Promise<Response> => 
  parseBody<Task>(req)
    .then(serverTasksDataService.updateTask)
    .then(() => Response.json({success: true}))
  .catch(handleAPIError);
