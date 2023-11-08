import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { handleAPIError } from "@/app/utils/api.utils";

export const GET = (): Promise<Response> => serverCalendarDataService.findEventsFromUniv().then(Response.json).catch(handleAPIError);
