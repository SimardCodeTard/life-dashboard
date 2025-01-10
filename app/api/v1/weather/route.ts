import { serverWeatherDataService } from "@/app/services/server/weather-data.server.service";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

export const GET = (req: NextRequest): Promise<Response> => 
    serverWeatherDataService.fetchWeatherData(getUrlParam(req, 'longitude'), getUrlParam(req, 'latitude'))
        .then(Response.json)
    .catch(handleAPIError);
