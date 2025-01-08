import { serverCalendarDataService } from "@/app/services/server/calendar-data.server.service";
import { CalendarSourceType } from "@/app/types/calendar.type";
import { handleAPIError } from "@/app/utils/api.utils";

export const POST = (req: Request) => (req.json() as Promise<CalendarSourceType>).then(source => ({...source, url: serverCalendarDataService.patchCalendarSourceURL(source.url)})).then(serverCalendarDataService.saveNewCalendarSource).then(Response.json).catch(handleAPIError);