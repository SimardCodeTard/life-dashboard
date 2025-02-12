"use client";
import { useEffect, useState } from "react";

import './weather.scss';
import { Logger } from "@/app/services/logger.service";
import { WeatherData } from "@/app/types/weather.type";
import CurrentWeather from "./current-weather/current-weather.component";
import FiveDaysForecast from "./five-days-forecast/five-days-forcast.component";
import Loader from "../../shared/loader/loader.component";
import axios from "axios";
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { DateTime } from "luxon";

export default function Weather({setIsLoading}: {setIsLoading?: (isLoading: boolean) => void}) {

    const [weatherData, setWeatherData] = useState<WeatherData| null>(null);
    
    const fetchWeatherData = (latitude: number, longitude: number)=> {
        const url = process.env.NEXT_PUBLIC_API_URL + `/weather?latitude=${latitude}&longitude=${longitude}&startTime=${DateTime.now().toMillis()}`;
        return fetch(url);
    }

    useEffect(() => {

        setIsLoading?.(true);
        navigator.geolocation.getCurrentPosition((userLocation: GeolocationPosition) => {
            if(userLocation.coords.latitude && userLocation.coords.longitude) {
                fetchWeatherData(userLocation.coords.latitude, userLocation.coords.longitude)
                .then((res) => res.json() as Promise<WeatherData>)
                .then(data => {
                    console.log('Weather: weather data,', data)
                    return data;
                })
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
