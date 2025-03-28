import { CurrentWeatherApiResponse, LocationApiResponse } from "@/app/types/weather.type";

import './current-weather.scss';

export default function CurrentWeather({currentWeatherData, locationData}: Readonly<{currentWeatherData: CurrentWeatherApiResponse, locationData: LocationApiResponse}>) {

    return <div className="current-weather">
        <div className="weather-temperature-and-city">
            <h3 className="weather-current-temperature">{Math.floor(currentWeatherData.current.temp)}°C</h3>
            <p className="subtitle" >{`${locationData[0].name}, ${locationData[0].country}`}</p>
        </div>
        <div className="weather-infos">
            <img src={`https://openweathermap.org/img/wn/${currentWeatherData.current.weather[0].icon}@2x.png`} alt=''></img>
        </div>
    </div>
}