import { serverTasksDataService } from "@/app/services/server/tasks-data.server.service";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const DELETE = (req: NextRequest): Promise<Response> => 
    serverTasksDataService.deleteTaskById(new ObjectId(getUrlParam(req, 'id')))
        .then(() => Response.json({success: true}))
    .catch(handleAPIError);