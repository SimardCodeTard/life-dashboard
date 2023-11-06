import axios from "axios";
import { assert } from "console";

export async function GET(req: Request) {
    assert(process.env.OPEN_WEATHER_API_KEY !== undefined)

    const paramMap = new Map<string, string>()

    req.url.slice(req.url.indexOf('?') + 1)
    .split('&').map(
        (param: string) => {
            const tokens = param.split('=');
            paramMap.set(tokens[0], tokens[1]);
        }
    );
    
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${paramMap.get('latitude')}&lon=${paramMap.get('longitude')}&exclude=minutely,hourly,daily,alerts&appid=${process.env.OPEN_WEATHER_API_KEY}&units=metric`
    
    const weatherData = await axios.get(url).then(res => res.data);

    return Response.json(weatherData);
}