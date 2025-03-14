import { handleAxiosError } from "@/app/utils/api.utils";
import axios, { AxiosError } from "axios";
import { Logger } from "../logger.service";

/**
 * Namespace for server weather data service.
 */
export namespace serverWeatherDataService {
    /**
     * Constructs the URL for the weather data API.
     * @param longitude - The longitude of the location.
     * @param latitude - The latitude of the location.
     * @returns The constructed URL string.
     */
    const currentWeatherUrl = (longitude: string, latitude: string): string => 
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;
// &exclude=minutely,hourly,daily,alerts

    const forecastWeatherUrl = (longitude: string, latitude: string): string =>
        `https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric&cnt=5`

    /**
     * Fetches weather data from the API.
     * @param longitude - The longitude of the location.
     * @param latitude - The latitude of the location.
     * @returns A promise that resolves to the weather data.
     */
    export const fetchCurrentWeatherData = async (longitude: string, latitude: string): Promise<any> => {
        try {
            const response = await axios.get(currentWeatherUrl(longitude, latitude));
            Logger.debug(`Fetched weather data: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch (error) {
            Logger.error('Failed to call external api: ' + currentWeatherUrl(longitude, latitude));
            handleAxiosError(error as AxiosError);
        }
    };

    export const fetch5DaysForecastWeatherData = async (longitude: string, latitude: string): Promise<any> => {
        try {
            const response = await axios.get(forecastWeatherUrl(longitude, latitude));
            Logger.debug(`Fetched weather data: ${JSON.stringify(response.data)}`);
            return response.data;
        } catch(error) {
            handleAxiosError(error as AxiosError);
        }
    }
}