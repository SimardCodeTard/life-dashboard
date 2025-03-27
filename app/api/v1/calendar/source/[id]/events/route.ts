import { APINotFoundError } from "@/app/errors/api.error";
import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { CalendarEventsBySourceIdResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";

export const dynamic = 'force-dynamic';

const getHandler = async(params: Promise<{ id: string }>): Promise<CalendarEventsBySourceIdResponseType> => {
    const source = await serverCalendarDataService.findCalendarSourceById(new ObjectId((await params).id));
    
    if(source === null) {
        throw new APINotFoundError('Calendar source not found');
    }

    return serverCalendarDataService.fetchAndParseCalendarEvents(source);
}

export const GET = async (_: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> => {
    try {
        return Response.json(await getHandler(params));
    } catch (err) {
        return handleAPIError(err);
    }
}