"use client"

import { useEffect, useState } from "react";
import Loader from "../shared/loader/loader.component";

import '../components.css';

export default function Weather() {
    let [weatherData, setWeatherData] = useState<any>(null);

    const fetchWeatherData = (latitude: number, longitude: number) => {
        const url = process.env.NEXT_PUBLIC_API_URL + `/weather?latitude=${latitude}&longitude=${longitude}`
        return fetch(url);
    }

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


    useEffect(() => {
        navigator.geolocation.getCurrentPosition((userLocation: GeolocationPosition) => {
            if(userLocation.coords.latitude && userLocation.coords.longitude) {
                fetchWeatherData(userLocation.coords.latitude, userLocation.coords.longitude)
                .then((res) => res.json())
                .then(setWeatherData);    
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
            <h2>Météo</h2>
            {weatherData?.current
                ? <div className="weather-body">
                    <div>
                        <img src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}></img>
                    </div>
                    <div>
                        <div className="temperature-display">
                            <h3>{(weatherData as any).current.weather[0].main}</h3>
                            <p className={getTemperatureColorClass(weatherData.current.temp)}>{(weatherData as any).current.temp + '°C'}</p>
                        </div>
                        <p className="subtitle">{(weatherData as any).current.weather[0].description}</p>
                    </div>
                </div> 
                : <Loader></Loader>
            }
        </div>
    )
}
