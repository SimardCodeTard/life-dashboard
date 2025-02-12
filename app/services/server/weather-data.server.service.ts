import { handleAxiosError } from "@/app/utils/api.utils";
import axios, { AxiosError } from "axios";

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
    const url = (longitude: string, latitude: string): string => 
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;

    /**
     * Fetches weather data from the API.
     * @param longitude - The longitude of the location.
     * @param latitude - The latitude of the location.
     * @returns A promise that resolves to the weather data.
     */
    export const fetchWeatherData = async (longitude: string, latitude: string): Promise<any> => {
        try {
            const response = await axios.get(url(longitude, latitude));
            return response.data;
        } catch (error) {
            handleAxiosError(error as AxiosError);
        }
    };
}