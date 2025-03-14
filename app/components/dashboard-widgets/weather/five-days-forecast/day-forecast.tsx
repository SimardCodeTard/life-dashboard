import { ForecastWeatherApiResponse } from "@/app/types/weather.type";
import { days } from "@/app/utils/date.util";
import { DateTime } from "luxon";

import './five-days-forecast.scss'

export default function DayForecast({dayForecastData}: {dayForecastData: ForecastWeatherApiResponse}) {
    const date = DateTime.fromMillis(Math.trunc(dayForecastData.data[0].dt));
    const weekDay = date.weekday;
    const temp = dayForecastData.data[0].temp;
    const imageUrl = `https://openweathermap.org/img/wn/${dayForecastData.data[0].weather[0].icon}@2x.png`
    return <div className="day-forecast">
        <p>{days[weekDay].substring(0, 3)}</p>
        <img src={imageUrl} alt={dayForecastData.data[0].weather[0].description} />
        <p>{temp}°C</p>
    </div>
}