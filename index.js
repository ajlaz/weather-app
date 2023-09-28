async function getWeatherData () {
    const BingMapsKey = 'AthFmxuwV7tYF-gXC1MB2QtWDScSOD1sKJ062JWFXSwQObKhk4X6GSgjV6p-6hel'
    const location = document.getElementById('location').value;
    const originUrl = `http://dev.virtualearth.net/REST/v1/Locations?countryRegion=United%20States&adminDistrict=-&locality=${location}&postalCode=-&addressLine=-&userLocation=&key=${BingMapsKey}`;
    

    const res = await (await fetch(originUrl)).json();
    const lat = res.resourceSets[0].resources[0].point.coordinates[0];
    const long = res.resourceSets[0].resources[0].point.coordinates[1];

    const weatherRes = await (await fetch(`https://api.weather.gov/points/${lat},${long}`)).json();
    const forecastUrl = weatherRes.properties.forecastHourly;
    console.log(forecastUrl);
    const forecastRes = await (await fetch(forecastUrl)).json();
    let currentWeather;
    await forecastRes.properties.periods.map((period) => {
        const time = new Date(period.startTime);
        if(time.getUTCDate() == new Date().getUTCDate() && time.getUTCHours() == new Date().getUTCHours()) {
            currentWeather = {
                time: period.startTime,
                temperature: period.temperature,
                windSpeed: period.windSpeed,
                windDirection: period.windDirection,
                shortForecast: period.shortForecast,
                icon: period.icon
            }
        }
    });

    //Set the weather data
    document.getElementById('weather-location').innerHTML = location;
    document.getElementById('weather-temp').innerHTML = currentWeather.temperature + '°F';
    document.getElementById('weather-wind').innerHTML = currentWeather.windSpeed + ' ' + currentWeather.windDirection;
    document.getElementById('weather-desc').innerHTML = currentWeather.shortForecast;
    switch(currentWeather.shortForecast) {
        case 'Sunny':
            document.getElementById('weather-icon').className = 'fa fa-sun';
            break;
        case 'Mostly Sunny':
            document.getElementById('weather-icon').className = 'fa fa-sun';
            break;
        case 'Partly Sunny':
            document.getElementById('weather-icon').className = 'fa fa-cloud-sun';
            break;
        case 'Mostly Cloudy':
            document.getElementById('weather-icon').className = 'fa fa-cloud';
            break;
        case 'Cloudy':
            document.getElementById('weather-icon').className = 'fa fa-cloud';
            break;
        case 'Rain':
            document.getElementById('weather-icon').className = 'fa fa-cloud-rain';
            break;
        case 'Showers':
            document.getElementById('weather-icon').className = 'fa fa-cloud-showers-heavy';
            break;
        case 'Thunderstorms':
            document.getElementById('weather-icon').className = 'fa fa-bolt';
            break;
        case 'Snow':
            document.getElementById('weather-icon').className = 'fa fa-snowflake';
            break;
        case 'Sleet':
            document.getElementById('weather-icon').className = 'fa fa-snowflake';
            break;
        default:
            document.getElementById('weather-icon').className = 'fa fa-cloud';
            break;
    }
    console.log(currentWeather);
}

