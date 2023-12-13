import { handleAxiosError } from "@/app/utils/api.utils";
import axios from "axios";

export namespace WeatherDataServerService {
    const url = (longitude: string, latitude: string) => `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&appid=${process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`

    export const fetchWeatherData = (longitude: string, latitude: string) => axios.get(url(longitude, latitude)).then(res => res.data).catch(handleAxiosError);
}