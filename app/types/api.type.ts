import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { CalendarEventTypeDTO, CalendarSourceType } from "./calendar.type";
import { UserTypeClient, UserTypeServer } from "./user.type";
import { FavoriteItemType } from "./favorites.type";
import { TaskType, TaskTypeDto } from "./task.type";
import { ChatMessageType } from "./chat.type";
import { CurrentWeatherApiResponse, ForecastWeatherApiResponse } from "./weather.type";

/* ========================================== AUTH API ========================================== */

    // /login
        export type AuthLoginResponseType = { token: string; refreshToken?: string; user: UserTypeClient; };

        export type AuthLoginRequestBodyType = { mail: string,  password: string,  keepLoggedIn: boolean };

    // ------------- /register -------------
        export type AuthRegisterResponseType = AuthLoginResponseType;

        export type AuthRegisterRequestBodyType = {user: UserTypeServer, keepLoggedIn: boolean};

    // ------------- /validate -------------
        export type AuthValidateResponseType = { valid: boolean, token?: string, user?: UserTypeClient };

        export type AuthValidateRequestBodyType = { mail: string, token?: string, refreshToken?: string };

/* ========================================== CALENDAR API ========================================== */

    // ------------- /events -------------
        export type CalendarEventsResponseType = {
            [key: string]: CalendarEventTypeDTO[]
        };

    // ------------- /source/[id]/events -------------
        export type CalendarEventsBySourceIdResponseType = CalendarEventTypeDTO[];

    // ------------- /source/[id] -------------
        export type CalendarSourceIdDeleteResponseType = DeleteResult;

        export type CalendarSourceIdPutResponseType = null | UpdateResult<CalendarSourceType>;
        export type CalendarSourceIdPutRequestBodyType = CalendarSourceType;

    // ------------- /source/new -------------
        export type CalendarSourceNewResponseType = CalendarSourceType;
        export type CalendarSourceNewRequestBodyType = CalendarSourceType;

    // ------------- /source -------------
        export type CalendarSourceResponseType = CalendarSourceType[];

/* ========================================== CHAT API ========================================== */

    // ------------- /new -------------
        export type ChatNewResponseType = ChatMessageType[];

    // ------------- / -------------
        export type ChatResponseType = ChatMessageType[];
        export type ChatRequestBodyType = ChatMessageType;

/* ========================================== FAVORITES API ========================================== */

    // ------------- /delete -------------
        export type FavoritesDeleteResponseType = DeleteResult;

    // ------------- /new -------------
        export type FavoritesNewResponseType = InsertOneResult<FavoriteItemType>;
        export type FavoritesNewRequestBodyType = FavoriteItemType;

    // ------------- /update -------------
        export type FavoritesUpdateResponseType = null | UpdateResult<FavoriteItemType>;
        export type FavoritesUpdateRequestBodyType = FavoriteItemType;

    // ------------- / -------------
        export type FavoritesResponseType = FavoriteItemType[];

/* ========================================== TASK API ========================================== */

    // ------------- /[id] -------------
        export type TaskIdResponseType = TaskTypeDto;

    // ------------- /delete -------------
        export type TaskDeleteResponseType = DeleteResult;

    // ------------- /new -------------
        export type TaskNewResponseType = InsertOneResult<TaskType>;
        export type TaskNewRequestBodyType = TaskTypeDto;

    // ------------- /update -------------
        export type TaskUpdateResponseType = null | UpdateResult<TaskType>;
        export type TaskUpdateRequestBodyType = TaskTypeDto;

    // ------------- / -------------
        export type TaskResponseType = TaskTypeDto[];

/* ========================================== TASK API ========================================== */
    // ------------- / -------------
        export type WeatherResponseType = {current: CurrentWeatherApiResponse, forecast: ForecastWeatherApiResponse[]};