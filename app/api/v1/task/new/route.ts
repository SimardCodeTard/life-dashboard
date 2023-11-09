import { TasksDataServerService } from "@/app/services/tasks-data.server.service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const chunks = [];
    for await (const chunk of req.body as any) {
      chunks.push(chunk);
    }

    const data = Buffer.concat(chunks).toString();
    const newTask = JSON.parse(data); 
    
    await TasksDataServerService.saveTask(newTask);

    console.log('New task saved !')

    return Response.json({ success: true });
  }
  