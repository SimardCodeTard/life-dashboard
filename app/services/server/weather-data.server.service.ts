import { CurrentWeatherApiResponse, ForecastWeatherApiResponse } from "@/app/types/weather.type";
import { handleAxiosError } from "@/app/utils/api.utils";
import axios, { AxiosError } from "axios";
import { DateTime } from "luxon";

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
    const getCurrentWeatherUrl = (longitude: string, latitude: string): string => 
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;

    const getForecastWeatherUrl = (longitude: string, latitude: string, timeStamp: number): string =>
        `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${timeStamp}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`;

    /**
     * Fetches weather data from the API.
     * @param longitude - The longitude of the location.
     * @param latitude - The latitude of the location.
     * @returns A promise that resolves to the weather data.
     */
    export const fetchCurrentWeatherData = async (longitude: string, latitude: string): Promise<CurrentWeatherApiResponse | undefined> => {
        let weatherData: CurrentWeatherApiResponse | undefined;
        
        try {
            weatherData = await axios.get<CurrentWeatherApiResponse>(getCurrentWeatherUrl(longitude, latitude)).then(res => res.data);
        } catch (error) {
            handleAxiosError(error as AxiosError);
        }

        return weatherData;
    };

    /**
     * 
     * @param longitude - The longitude of the location.
     * @param latitude - The latitude of the location
     * @returns A promise that resolves to the weather data for the next 5 days.
     */

    export const fetch5DaysForecastWeatherData = async (longitude: string, latitude: string, startTime: number): Promise<(ForecastWeatherApiResponse | undefined) []> => {

        const dateTimes: number[] = [];

        for(let i = 1; i <= 4; i++) {
            const date = DateTime.fromMillis(startTime).plus({days: i});
            dateTimes.push(Math.floor(date.toSeconds()));
        }

        const forecasts = await Promise.all(dateTimes.map(async (timeStamp) => {
            try {
                const response = await axios.get<ForecastWeatherApiResponse>(getForecastWeatherUrl(longitude, latitude, timeStamp));
                return response.data;
            } catch(error) {
                handleAxiosError(error as AxiosError);
            }
        }));

        return forecasts;
    }
}