import { ForecastWeatherApiResponse } from "@/app/types/weather.type";
import DayForecast from "./day-forecast";

import './five-days-forecast.scss';

export default function FiveDaysForecast({weatherForecastsData}: Readonly<{weatherForecastsData: ForecastWeatherApiResponse[]}>) {

    return <div className="five-days-forecast">
        {weatherForecastsData.map((dayForecast, key) => {
            return <DayForecast key={`day-forecast-${dayForecast.data[0].dt}`} dayForecastData={dayForecast}></DayForecast>
        })
    }</div>
}