

const weatherService = {
    async getWeather(lat, lon) {

        //https://api.open-meteo.com/v1/forecast?latitude=51.25&longitude=7.15&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,is_day,precipitation,cloud_cover,wind_speed_10m&timezone=auto&forecast_days=1
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            hourly: 'temperature_2m',
            current: 'temperature_2m,relative_humidity_2m,is_day,wind_speed_10m',
            timezone: 'auto',
            forecast_days: 1,
        });

        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
        const response = await fetch(url);
        const data = await response.json();

        return data;
    }
}

export default weatherService;
