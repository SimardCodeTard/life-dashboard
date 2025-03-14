import { ForecastWeatherApiResponse } from "@/app/types/weather.type";
import DayForecast from "./day-forecast";

import './five-days-forecast.scss'

export default function FiveDaysForecast({weatherForecastsData}: {weatherForecastsData: ForecastWeatherApiResponse[]}) {
    return <div className="five-days-forecast">
        {weatherForecastsData.map(dayForecast => {
                return <DayForecast dayForecastData={dayForecast}></DayForecast>
        })
    }</div>
}