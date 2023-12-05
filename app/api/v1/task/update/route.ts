import { TasksDataServerService } from "@/app/services/server/tasks-data.server.service";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest): Promise<Response> {
    const chunks = [];
    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }


    const data = Buffer.concat(chunks).toString();
    const taskToUpdate = JSON.parse(data); 

    const res = taskToUpdate ? await TasksDataServerService.updateTask(taskToUpdate) : null;

    return res !== null && res.acknowledged ? Response.json({success: true}) : Response.json({success: false});
}