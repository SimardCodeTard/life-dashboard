import { APINotFoundError } from "@/app/errors/api.error";
import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { CalendarSourceType } from "@/app/types/calendar.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    try {
        const source = await serverCalendarDataService.findCalendarSourceById(new ObjectId((await params).id));
    
        if(source === null) {
            throw new APINotFoundError('Calendar source not found');
        }
    
        const events = await serverCalendarDataService.fetchAndParseCalendarEvents(source as CalendarSourceType);
    
        return Response.json(events);
    } catch (error) {
        return handleAPIError(error as Error);
    }
}