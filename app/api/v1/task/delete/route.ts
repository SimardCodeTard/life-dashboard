import { TasksDataServerService } from "@/app/services/server/tasks-data.server.service";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
    const taskId = req.url.split('?')[1].split('=')[1];
    const res = taskId ? await TasksDataServerService.deleteTaskById(new ObjectId(taskId)) : null;
    return res !== null && res.acknowledged ? Response.json({success: true}) : Response.json({success: false});
}