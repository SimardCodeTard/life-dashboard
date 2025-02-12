'use client';
import { ForecastWeatherApiResponse } from "@/app/types/weather.type";
import { useState } from "react";
import { DateTime } from "luxon";
import { capitalize } from "@/app/utils/string.util";

import './five-days-forecast.scss';

export default function DayForecast({dayForecastData}: Readonly<{dayForecastData: ForecastWeatherApiResponse}>) {

    const [date] = useState(DateTime.fromSeconds(Math.floor(dayForecastData.data[0].dt)));
    const [weekDay] = useState(capitalize(date.weekdayShort));
    const [temp] = useState(Math.floor(dayForecastData.data[0].temp));
    const [imageUrl] = useState(`https://openweathermap.org/img/wn/${dayForecastData.data[0].weather[0].icon}@2x.png`);

    return <div className="day-forecast">
        <p>{weekDay}</p>
        <img src={imageUrl} alt={dayForecastData.data[0].weather[0].description} />
        <p>{temp}°C</p>
    </div>
}