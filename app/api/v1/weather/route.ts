import { serverWeatherDataService } from "@/app/services/server/weather-data.server.service";
import { getUrlParam, handleAPIError } from "@/app/utils/api.utils";
import { NextRequest } from "next/server";

/**
 * Handles GET requests to fetch weather data based on longitude and latitude parameters.
 * 
 * @param {NextRequest} req - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a Response object containing weather data.
 */
export const GET = async (req: NextRequest): Promise<Response> => {
    try {
        // Extract longitude and latitude from the request URL parameters
        const longitude = getUrlParam(req, 'longitude');
        const latitude = getUrlParam(req, 'latitude');

        // Fetch weather data using the extracted parameters
        const weatherData = await serverWeatherDataService.fetchWeatherData(longitude, latitude);

        // Return the weather data as a JSON response
        return new Response(JSON.stringify(weatherData), { status: 200 });
    } catch (error) {
        // Handle any errors that occur during the process
        return handleAPIError(error as Error);
    }
};