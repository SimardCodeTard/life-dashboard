import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { CalendarSourceNewRequestBodyType, CalendarSourceNewResponseType } from "@/app/types/api.type";
import { CalendarSourceType } from "@/app/types/calendar.type";
import { handleAPIError, parseBody } from "@/app/utils/api.utils";

/**
 * Handles the POST request to add a new calendar source.
 * 
 * @param req - The incoming request object
 * @returns A promise that resolves to a JSON response
 */

const postHandler = async (req: Request): Promise<CalendarSourceNewResponseType> => {
    // Parse the request body as CalendarSourceType
    const source: CalendarSourceType = await parseBody<CalendarSourceNewRequestBodyType>(req);

    // Update the URL in the source object
    source.url = serverCalendarDataService.patchCalendarSourceURL(source.url);

    // Save the new calendar source
    return serverCalendarDataService.saveNewCalendarSource(source);
}

export const POST = async (req: Request): Promise<Response> => Response.json(await postHandler(req).catch(handleAPIError));