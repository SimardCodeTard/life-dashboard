import { WeatherResponseType } from "@/app/types/api.type";
import { axiosClientService } from "./axios.client.service";
import { DateTime } from "luxon";

export namespace weatherClientService {

    const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/weather'

    export const fetchWeatherData = async (latitude: number, longitude: number, startTime: DateTime): Promise<WeatherResponseType> => {
        return axiosClientService.GET<WeatherResponseType>(apiUrl + `?latitude=${latitude}&longitude=${longitude}&startTime=${startTime.toMillis()}`).then(res => res.data);
    }
}