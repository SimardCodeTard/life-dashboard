import { TasksDataServerService } from "@/app/services/tasks-data.server.service";

export async function GET() {
    const tasks = await TasksDataServerService.findAllTasks();
    return Response.json(tasks); 
}