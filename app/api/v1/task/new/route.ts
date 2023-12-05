import { TasksDataServerService } from "@/app/services/server/tasks-data.server.service";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const chunks = [];
  for await (const chunk of req.body as any) {
    chunks.push(chunk);
  }

  const data = Buffer.concat(chunks).toString();
  const newTask = JSON.parse(data); 

  const res = newTask ? await TasksDataServerService.saveTask(newTask) : null;

  return res !== null && res.acknowledged ? Response.json({success: true}) : Response.json({success: false});
}  
  