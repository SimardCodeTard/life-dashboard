import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";
import { serverWeatherDataService } from "@/app/services/server/weather-data.server.service";
import { APIBadRequestError, APIInternalServerError } from "@/app/errors/api.error";
import { WeatherResponseType } from "@/app/types/api.type";
import { ForecastWeatherApiResponse } from "@/app/types/weather.type";

export const dynamic = 'force-dynamic';

/**
 * Handles GET requests to fetch weather data based on longitude and latitude parameters.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a Response object containing weather data.
 */

const getHandler = async (req: NextRequest): Promise<WeatherResponseType> => {
    const longitude = getUrlParam(req, 'longitude');
    const latitude = getUrlParam(req, 'latitude');
    const startTime = Number(getUrlParam(req, 'startTime'));

    if(!longitude || !latitude || !startTime || isNaN(startTime)) {
        throw new APIBadRequestError('Missing or invalid parameters');
    }

    // Fetch weather data using the extracted parameters
    const weatherData = await serverWeatherDataService.fetchCurrentWeatherData(longitude, latitude);
    const forecastData = await serverWeatherDataService.fetch5DaysForecastWeatherData(longitude, latitude, startTime);
    const locationData = await serverWeatherDataService.fetchLocationData(latitude, longitude);

    if(!weatherData || !forecastData || forecastData.includes(undefined) || !locationData) {
        throw new APIInternalServerError('Failed to fetch weather data');
    }

    return {current: weatherData, forecast: forecastData as ForecastWeatherApiResponse[], location: locationData};
}

export const GET = async (req: NextRequest): Promise<Response> => {
    try {
      return Response.json(await getHandler(req));
    } catch (err) {
      return handleAPIError(err);
    }
}