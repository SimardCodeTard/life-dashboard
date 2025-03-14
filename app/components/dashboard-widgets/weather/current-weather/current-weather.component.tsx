import { CurrentWeatherApiResponse } from "@/app/types/weather.type";

import './current-weather.scss';

export default function CurrentWeather({currentWeatherData, locationData}: {currentWeatherData: CurrentWeatherApiResponse, locationData: {city: string, state: string}}) {

    const getTemperatureColorClass = (temperature: number): string => {
        if(temperature < -20) {
            return 'temperature-color-freezing'
        } else if (temperature < 0 ){
            return 'temperature-color-cold'
        } else if (temperature < 20){
            return 'temperature-color-mild'
        } else if (temperature < 30) {
            return 'temperature-color-warm'
        } else if (temperature < 40) {
            return 'temperature-color-hot'
        } else if (temperature < 50) {
            return 'temperature-color-very-hot'
        } else if (temperature >= 50) {
            return 'temperature-color-extreme'
        }
        return '';
    }

    return <div className="current-weather">
        <div className="weather-temperature-and-city">
            <h3 className="weather-current-temperature">{currentWeatherData.current.temp}°C</h3>
            <p className="subtitle">{locationData.city}, {locationData.state}</p>
        </div>
        <div className="weather-infos">
            <img src={`https://openweathermap.org/img/wn/${currentWeatherData.current.weather[0].icon}@2x.png`}></img>
        </div>
    </div>
}