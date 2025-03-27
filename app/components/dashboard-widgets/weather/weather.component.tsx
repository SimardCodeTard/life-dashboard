"use client";;
import { useEffect, useState } from "react";

import './weather.scss';
import { Logger } from "@/app/services/logger.service";
import { WeatherData } from "@/app/types/weather.type";
import CurrentWeather from "./current-weather/current-weather.component";
import FiveDaysForecast from "./five-days-forecast/five-days-forcast.component";
import Loader from "../../shared/loader/loader.component";
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { DateTime } from "luxon";
import { weatherClientService } from "@/app/services/client/weather.client.service";

export default function Weather({setIsLoading}: Readonly<{setIsLoading?: (isLoading: boolean) => void}>) {

    const [weatherData, setWeatherData] = useState<WeatherData| null>(null);
    
    const fetchWeatherData = (latitude: number, longitude: number)=> {
        return weatherClientService.fetchWeatherData(latitude, longitude, DateTime.now());
    }

    useEffect(() => {

        setIsLoading?.(true);
        navigator.geolocation.getCurrentPosition((userLocation: GeolocationPosition) => {
            if(userLocation.coords.latitude && userLocation.coords.longitude) {
                fetchWeatherData(userLocation.coords.latitude, userLocation.coords.longitude)
                .then(data => setWeatherData(data))
                .finally(() => setIsLoading?.(false))
                .catch((error) => {
                    Logger.error('Failed to fetch, error: '+ error.message);
                });    
            } else {
                console.error("Error: Invalid geolocation coordinates")
            }
        }, (err: GeolocationPositionError) => {
            console.error('Failed to get user location. '+ err.code + err.message ? ': ' +err.message : '');
        }, {
            enableHighAccuracy: false,
            timeout:5000,
            maximumAge: Infinity
        });
    }, []);

    return (
        <div className="card-content">
            <div className='weather card-main-panel'>
                <div className="card-header">
                    <h2>Weather</h2>
                    <DeviceThermostatIcon/>
                </div>
                <div className="weather-body">{
                    weatherData?.current === null || weatherData?.forecast === null
                    ? <Loader></Loader>
                    : <>
                        {weatherData?.current && <CurrentWeather currentWeatherData={weatherData.current}></CurrentWeather>}
                        {weatherData?.forecast && <FiveDaysForecast weatherForecastsData={weatherData.forecast}></FiveDaysForecast>}
                    </> 
                }</div> 
            </div>
        </div>
    )
}
