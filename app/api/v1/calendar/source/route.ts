import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { handleAPIError } from "@/app/utils/api.utils";

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
export const GET = async () => {
    try {
        const calendarSources = await serverCalendarDataService.findAllCalendarSources();
        return Response.json(calendarSources);
    } catch (error) {
        return handleAPIError(error as Error);
    }
};