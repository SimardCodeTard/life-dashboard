import { TasksDataServerService } from "@/app/services/server/tasks-data.server.service";
import { handleAPIError } from "@/app/utils/api.utils";

export const dynamic = 'force-dynamic'
export const GET = () => TasksDataServerService.findAllTasks().then(Response.json).catch(handleAPIError);