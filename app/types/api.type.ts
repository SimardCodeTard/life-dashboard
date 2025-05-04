import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb";
import { CalendarEventTypeDTO, CalendarSourceType } from "./calendar.type";
import { UserTypeClient, UserTypeServer } from "./user.type";
import { FavoriteItemType } from "./favorites.type";
import { TaskType, TaskTypeDto } from "./task.type";
import { ChatMessageType } from "./chat.type";
import { CurrentWeatherApiResponse, ForecastWeatherApiResponse, LocationApiResponse } from "./weather.type";

/* ========================================== AUTH API ========================================== */

    // ------------- /login -------------
        export type AuthLoginResponseType = { user: UserTypeClient; };

        export type AuthLoginRequestBodyType = { mail: string,  password: string,  keepLoggedIn: boolean };

    // ------------- /logout -------------
        export type AuthLogoutResponseType = {success: true};

    // ------------- /logout/all -------------
        export type AuthLogoutAllResponseType = AuthLogoutResponseType

    // ------------- /register -------------
        export type AuthRegisterResponseType = AuthLoginResponseType;

        export type AuthRegisterRequestBodyType = {user: UserTypeServer, keepLoggedIn: boolean};

    // ------------- /switch-account -------------
        export type AuthSwitchAccountResponseType = {success: boolean};

    // ------------- /add-account -------------
        export type AuthAddAccountResponseType = AuthRegisterResponseType;

        export type AuthAddAccountRequestBodyType = {
            isNewAccount: true,
            content: AuthRegisterRequestBodyType,
        } | {
            isNewAccount: false,
            content: AuthLoginRequestBodyType
        };

    // ------------- /validate -------------
        export type AuthValidateResponseType = { user: UserTypeClient };


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
        export type UserPutRequestBodyType = UserTypeServer;
        export type UserPutResponseTye = UpdateResult<UserTypeServer> | null;

/* ========================================== WEATHER API ========================================== */
    // ------------- / -------------
        export type WeatherResponseType = {current: CurrentWeatherApiResponse, forecast: ForecastWeatherApiResponse[], location: LocationApiResponse};