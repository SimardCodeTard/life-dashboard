import { APIBadRequestError } from "@/app/errors/api.error";
import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { CalendarEventsResponseType } from "@/app/types/api.type";
import { CalendarEventTypeDTO } from "@/app/types/calendar.type";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";


export const dynamic = 'force-dynamic';

/**
 * GET handler to fetch calendar sources by IDs, fetch iCal data, and parse events.
 * @param req - The request object.
 * @returns A promise that resolves to a Response object containing a map of calendar events by source.
 */

const getHandler = async (req: NextRequest): Promise<CalendarEventsResponseType> => {
    const idsParam = getUrlParam(req, 'ids');

    if (!idsParam) {
        throw new APIBadRequestError('No calendar source IDs provided');
    }

    const ids = idsParam.split(',').map(id => new ObjectId(id));

    const calendarSources = await serverCalendarDataService.findCalendarSourceByIds(ids);

    const calendarEventsMap: Map<string, CalendarEventTypeDTO[]> = new Map();

    for(let calendarSource of calendarSources) {
        const calendarEvents = await serverCalendarDataService.fetchAndParseCalendarEvents(calendarSource);
        calendarEventsMap.set(JSON.stringify(calendarSource), calendarEvents);
    }

    return Object.fromEntries(calendarEventsMap);
}

export const GET = async (req: NextRequest): Promise<Response> => {
    try {
        return Response.json(await getHandler(req));
    } catch (err) {
        return handleAPIError(err);
    }
}
