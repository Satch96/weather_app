
const apiKey = process.env.API_KEY;
const url = 'https://api.openweathermap.org/data/2.5/weather?q=';
const searchButton = document.getElementById("searchButton");
const error_message = document.getElementById("error_message");
const celsius_button = document.getElementById("celsius");
const fahrenheit_button = document.getElementById("fahrenheit");

var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

require('dotenv').config();

let current_temp = "celsius";

searchButton.addEventListener("click",()=>{
    error_message.className = "error_message show"
    const location = document.getElementById("location");
    getWeather(location.value);
    location.value = "";
});

celsius_button.addEventListener("click",()=>{
    celsius_button.disabled = true;
    fahrenheit_button.disabled = false;
    current_temp = "celsius";

    const cityName = document.getElementById("cityName");
    getWeather(cityName.innerText);
});

fahrenheit_button.addEventListener("click", ()=>{
    fahrenheit_button.disabled = true;
    celsius_button.disabled = false;
    current_temp = "fahrenheit";

    const cityName = document.getElementById("cityName");
    getWeather(cityName.innerText);
})

async function getWeather(location){

    try{
    error_message.className = "error_message"
    const response = await fetch(url+location+apiKey, {mode: 'cors'});
    const data = await response.json();
    const result = processData(data);
    displayData(result);
    weatherIcon(data);
    }
    catch(err){
        console.log(err);
        error_message.classList.add("show");
    }
}


function processData(data){
    
    const myData = {
        
        cityName: data.name,
        current_temp: data.main.temp,
        feels_like: data.main.feels_like,
        max_temp: data.main.temp_max,
        min_temp: data.main.temp_min,
        description: data.weather[0].description,
        humidity: data.main.humidity
    };

    return myData;

}

function displayData(data){

    const cityName = document.getElementById("cityName")
    const mainTemp = document.getElementById("main");
    const feelsLike = document.getElementById("feels_like");
    const description = document.getElementById("img_description");
    const info = document.getElementById("info");

    cityName.innerHTML = data.cityName;
    description.innerHTML = data.description;
    

    if (current_temp == "celsius"){
        mainTemp.innerHTML = toCelsius(data.current_temp) + "°C";
        feelsLike.innerHTML = "Feels like " + toCelsius(data.feels_like) + "°C";
        info.innerHTML = "Highs of " + toCelsius(data.max_temp) + "°C" + '<br>' 
        + "Lows of " + toCelsius(data.min_temp) + "°C" + '<br>' 
        + "Humidity is " + data.humidity + " %";
    }
    else if (current_temp == "fahrenheit"){
        mainTemp.innerHTML = toFahrenheit(data.current_temp) + "°F";
        feelsLike.innerHTML = "Feels like " + toFahrenheit(data.feels_like) + "°F";
        info.innerHTML = "Highs of " + toFahrenheit(data.max_temp) + "°F" + '<br>' 
        + "Lows of " + toFahrenheit(data.min_temp) + "°F" + '<br>' 
        + "Humidity is " + data.humidity + " %";
    }
}

function toCelsius(temp){

    return Math.round(temp - 273.15);
}

function toFahrenheit(temp){

    return Math.round((temp - 273.15) * 9/5 + 32);
}

function weatherIcon(data){
    
    const img = document.querySelector("img");

    if (data.weather[0].icon == "01d" || data.weather[0].icon == "01n"){
        img.src = "weather_icons/clear_sky.png"
    }
    else if (data.weather[0].icon == "02d" || data.weather[0].icon == "02n"){
        img.src = "weather_icons/scattered_clouds.png"
    }
    else if (data.weather[0].icon == "03d" || data.weather[0].icon == "03n"){
        img.src = "weather_icons/clouds.png"
    }
    else if (data.weather[0].icon == "04d" || data.weather[0].icon == "04n"){
        img.src = "weather_icons/clouds.png"
    }
    else if (data.weather[0].icon == "09d" || data.weather[0].icon == "09n"){
        img.src = "weather_icons/showers.png"
    }
    else if (data.weather[0].icon == "10d" || data.weather[0].icon == "10n"){
        img.src = "weather_icons/rain.png"
    }
    else if (data.weather[0].icon == "11d" || data.weather[0].icon == "11n"){
        img.src = "weather_icons/thunderstorms.png"
    }
    else if (data.weather[0].icon == "13d" || data.weather[0].icon == "13n"){
        img.src = "weather_icons/snow.png"
    }
    else if (data.weather[0].icon == "50d" || data.weather[0].icon == "50n"){
        img.src = "weather_icons/mist.png"
    }
    else{
        img.src = "weather_icons/clear_sky.png"
    }
    
}

getWeather('london');
