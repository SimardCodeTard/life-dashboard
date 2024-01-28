import { handleAxiosError } from "@/app/utils/api.utils";
import axios from "axios";

export namespace serverWeatherDataService {
    const url = (longitude: string, latitude: string) => `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`

    export const fetchWeatherData = (longitude: string, latitude: string) => axios.get(url(longitude, latitude)).then(res => res.data).catch(handleAxiosError);
}