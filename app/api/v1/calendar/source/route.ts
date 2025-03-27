import { APIBadRequestError } from "@/app/errors/api.error";
import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { CalendarSourceResponseType } from "@/app/types/api.type";
import { handleAPIError } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

/**
 * GET handler for fetching all calendar sources.
 * 
 * This function uses the serverCalendarDataService to retrieve all calendar sources
 * and returns the result as a JSON response. If an error occurs, it is handled by
 * the handleAPIError utility function.
 * 
 * @returns {Promise<Response>} A promise that resolves to a JSON response containing all calendar sources.
 */

const getHandler = async (req: NextRequest): Promise<CalendarSourceResponseType> => {
    const userId = req.nextUrl.searchParams.get('userId');

    if(userId === null) {
        throw new APIBadRequestError('Missing required query parameters.');
    }
    
    return await serverCalendarDataService.findAllCalendarSources(userId);
}

export const GET = async (req: NextRequest): Promise<Response> => {
    try {
        return Response.json(await getHandler(req));
    } catch (err) {
        return handleAPIError(err);
    }
}