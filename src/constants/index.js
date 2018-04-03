/**
 * Created by Simon Neufville <simon@xrscodeworks.com> on March 29 2018 @ 17:22
 * Application Level Constants
 */

// PUBLIC API KEYS
export const PublicAPIConstants = {
    openWeatherKey: '01cdace90b3dd30b80531d5bdbd00b43'
};

// URL CONSTANTS
export const URLConstants = {
    openWeatherAPIURL: 'https://api.openweathermap.org/data/2.5/weather',
    openWeatherAPIForecastURL: 'https://api.openweathermap.org/data/2.5/forecast',
    quotesAPIURL: 'https://quotes.rest/qod'
};


export const WeatherGameLocations = [
    'Kingston, JM',
    'Tokyo, Japan',
    'Seoul, South Korea',
    'Sidney, Australia',
    'Toronto, Canada',
    'New York, US'
];

export const weatherGameAnswers = [
    { val: 'Clear, Clear Skies', code: 800 },
    { val: 'Cloudy, Partly Cloudy, Mostly Cloudy', code: 801 },
    { val: 'Drizzle, Light Rain', code: 300 },
    { val: 'Sleet, Snow, Snow Showers', code: 600 },
    { val: 'rain, showers', code: 500 },
    { val: 'Thunderstorms', code: 200 },
    { val: 'Smoke, Windy', code: 700 }
];

// Weather Icons
export const WeatherIconConstants = {
    clear: 'clearNightIcon.svg',
    lightning: 'lightingIcon.svg',
    mostlyCloudy: 'mostlyCloudyIcon.svg',
    partlyCloudy: 'partlyCloudyIcon.svg',
    partlyCloudyNight: 'partlyCloudyNightIcon.svg',
    rain: 'rainyIcon.svg',
    showers: 'showersIcon.svg',
    snowShowers: 'snowShowersIcon.svg',
    snow: 'snowyIcon',
    sunny: 'sunnyIcon',
    sunnyShowers: 'sunnyShowersIcon.svg',
    thundershowers: 'thundershowersIcon.svg',
    windy: 'windyIcon.svg',
    windySunny: 'windySunnyIcon.svg'
};
