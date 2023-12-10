import { TasksDataServerService } from "@/app/services/server/tasks-data.server.service";
import { Task } from "@/app/types/task.type";
import { parseBody } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

export const PUT = (req: NextRequest): Promise<Response> => parseBody<Task>(req).then(TasksDataServerService.updateTask).then(() => Response.json({success: true})).catch(Response.json);