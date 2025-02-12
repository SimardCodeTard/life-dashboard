import { CurrentWeatherApiResponse } from "@/app/types/weather.type";

import './current-weather.scss';

export default function CurrentWeather({currentWeatherData}: Readonly<{currentWeatherData: CurrentWeatherApiResponse}>) {

    return <div className="current-weather">
        <div className="weather-temperature-and-city">
            <h3 className="weather-current-temperature">{Math.floor(currentWeatherData.current.temp)}°C</h3>
        </div>
        <div className="weather-infos">
            <img src={`https://openweathermap.org/img/wn/${currentWeatherData.current.weather[0].icon}@2x.png`} alt=''></img>
        </div>
    </div>
}