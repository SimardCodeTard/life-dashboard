import { TasksDataServerService } from "@/app/services/tasks-data.server.service";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export function DELETE(req: NextRequest) {
    const taskId = req.url.split('?')[1].split('=')[1];
    TasksDataServerService.deleteTaskById(taskId)
    return Response.json({success: true});
}