import { TasksDataServerService } from "@/app/services/server/tasks-data.server.service";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest): Promise<Response> {
    const chunks = [];
    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }


    const data = Buffer.concat(chunks).toString();
    const taskToUpdate = JSON.parse(data); 

    await TasksDataServerService.updateTask(taskToUpdate)

    return Response.json({success: true});
}