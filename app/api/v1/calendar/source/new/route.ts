import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { CalendarSourceType } from "@/app/types/calendar.type";
import { handleAPIError } from "@/app/utils/api.utils";

/**
 * Handles the POST request to add a new calendar source.
 * 
 * @param req - The incoming request object
 * @returns A promise that resolves to a JSON response
 */
export const POST = async (req: Request): Promise<Response> => {
    try {
        // Parse the request body as CalendarSourceType
        const source: CalendarSourceType = await req.json();

        // Update the URL in the source object
        source.url = serverCalendarDataService.patchCalendarSourceURL(source.url);

        // Save the new calendar source
        const savedSource = await serverCalendarDataService.saveNewCalendarSource(source);

        // Return the saved source as a JSON response
        return Response.json(savedSource);
    } catch (error) {
        // Handle any errors that occur during the process
        return handleAPIError(error as Error);
    }
};