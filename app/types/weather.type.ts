//  CURRENT WEATHER TYPES

export interface CurrentWeatherApiResponse {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: Current;
    minutely: Minutely[];
    hourly: Current[];
    daily: Daily[];
    alerts: Alert[];
}

export interface Alert {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: any[];
}

export interface Current {
    dt: number;
    sunrise?: number;
    sunset?: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: Weather[];
    pop?: number;
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface Daily {
    dt: number;
    sunrise: number;
    sunset: number;
    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: Temp;
    feels_like: FeelsLike;
    pressure: number;
    humidity: number;
    dew_point: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: Weather[];
    clouds: number;
    pop: number;
    rain: number;
    uvi: number;
}

export interface FeelsLike {
    day: number;
    night: number;
    eve: number;
    morn: number;
}

export interface Temp {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
}

export interface Minutely {
    dt: number;
    precipitation: number;
}

// WEATHER FORECASTS TYPES

export interface ForecastWeatherApiResponse {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    data: Datum[];
}

export interface Datum {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: Weather[];
}

export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export type LocationApiResponse = Array<{
    name: string;
    local_names: Record<string, string>;
    lat: number;
    lon: number;
    country: string;
}>;


export interface WeatherData {
    current: CurrentWeatherApiResponse;
    forecast: ForecastWeatherApiResponse[];
    location: LocationApiResponse;
}