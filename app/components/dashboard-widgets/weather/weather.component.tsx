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

export default function Weather({setIsLoading}: {setIsLoading?: (isLoading: boolean) => void}) {

    const [weatherData, setWeatherData] = useState<WeatherData| null>(null);
    const [locationData, setLocationData] = useState({city: 'San Fransisco', state: 'CA'});
    
    const fetchWeatherData = (latitude: number, longitude: number)=> {
        const url = process.env.NEXT_PUBLIC_API_URL + `/weather?latitude=${latitude}&longitude=${longitude}`
        return fetch(url);
    }

    useEffect(() => {

        try {
            axios.get('http://ip-api.com/json').then(res => {
                const data = res.data;
                console.log(data)
                setLocationData({city: data.city, state: data.countryCode});
            });
        } catch (err) {
            Logger.error((err as Error).message);
            Logger.error('Failed to call ip-api.com to find user\'s city and state');
        }
        

        setIsLoading && setIsLoading(true);
        navigator.geolocation.getCurrentPosition((userLocation: GeolocationPosition) => {
            if(userLocation.coords.latitude && userLocation.coords.longitude) {
                fetchWeatherData(userLocation.coords.latitude, userLocation.coords.longitude)
                .then((res) => res.json() as Promise<WeatherData>)
                .then(data => {
                    console.log('Weather: weather data,', data)
                    return data;
                })
                .then(data => setWeatherData(data))
                .finally(() => setIsLoading && setIsLoading(false))
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
        <div className='weather'>
            <div className="card-header">
                <h2>Weather</h2>
                <DeviceThermostatIcon/>
            </div>
            <div className="weather-body">{
                weatherData === null || weatherData.current === null || weatherData.forecast === null
                ? <Loader></Loader>
                : <>
                    {weatherData && weatherData.current && <CurrentWeather locationData={locationData} currentWeatherData={weatherData.current}></CurrentWeather>}
                    <FiveDaysForecast weatherForecastsData={weatherData.forecast}></FiveDaysForecast>
                </> 
            }</div> 
        </div>
    )
}
