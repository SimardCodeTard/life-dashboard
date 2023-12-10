import { UnivCalendarLineIndexesEnum } from "@/app/enums/univ-calendar-indexes.enum";
import { CalendarDataServerService } from "@/app/services/server/calendar-data.server.service";
import { CalendarEventTypeDTO } from "@/app/types/calendar.type";
import { handleAPIError } from "@/app/utils/api.utils";
import assert from "assert";
export const GET = (): Promise<Response> => CalendarDataServerService.findEventsFromUniv().then(Response.json).catch(handleAPIError);