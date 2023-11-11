"use client"

import { useEffect, useState } from "react";

export default function Weather() {
    let [weatherData, setWeatherData] = useState<any>(null);

    const fetchWeatherData = (latitude: number, longitude: number) => {
        const url = process.env.NEXT_PUBLIC_API_URL + `/weather?latitude=${latitude}&longitude=${longitude}`
        return fetch(url);
    }

    const colorizeTemperature = (temperature: number): string => {
        if(temperature < -20) {
            return 'rgb(107,230,232)'
        } else if (temperature < 0 ){
            return 'rgb(83,180,224)'
        } else if (temperature < 20){
            return 'rgb(138,224,72)'
        } else if (temperature < 30) {
            return 'rgb(204, 103, 41)'
        } else if (temperature < 40) {
            return 'rgb(227, 88, 2)'
        } else if (temperature < 50) {
            return 'rgb(227, 2, 2)'
        } else if (temperature >= 50) {
            return 'rgb(103,41,204)'

        }
        return 'white'
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
        <div className="p-2">
            <h2>Météo</h2>
            {weatherData 
                ? <div className="flex items-center">
                    <div>
                        <img src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}></img>
                    </div>
                    <div>
                        <div className="flex space-x-2 items-center">
                            <h3 className="text-xl font-semibold">{(weatherData as any).current.weather[0].main}</h3>
                            <p style={{'color': colorizeTemperature(weatherData.current.temp)}}>{(weatherData as any).current.temp + '°C'}</p>
                        </div>
                        <p className="text-[rgb(var(--text-lighter-rgb))]">{(weatherData as any).current.weather[0].description}</p>
                    </div>
                </div> 
                : <p>Loading ...</p>
            }
        </div>
    )
}
