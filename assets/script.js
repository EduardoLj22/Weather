const API_KEY = '4299344d4085a254a8c904c0ce189a70';

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeather(city);
    }
});

function fetchWeather(city) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    Promise.all([
        fetch(currentWeatherUrl).then(response => response.json()),
        fetch(forecastUrl).then(response => response.json())
    ]).then(data => {
        console.log(data);
        const [currentWeather, forecast] = data;
        if (currentWeather.cod === 200 && forecast.cod === "200") {
            displayCurrentWeather(currentWeather);
            displayForecast(forecast);
            updateHistory(city);
        } else {
            alert('City not found');
        }
    }).catch(error => {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data');
    });
}

function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <h2>${data.name} (${new Date(data.dt * 1000).toLocaleDateString()})</h2>
        <div class="weather-item">
            <div>
                <p>Temp: ${data.main.temp}°C</p>
                <p>Wind: ${data.wind.speed} m/s</p>
                <p>Humidity: ${data.main.humidity}%</p>
            </div>
            <img class="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
        </div>
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '<h2>5-Day Forecast:</h2>';

    const filteredForecast = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    filteredForecast.forEach(item => {
        forecastDiv.innerHTML += `
            <div class="weather-item">
                <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img class="weather-icon" src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                <p>Temp: ${item.main.temp}°C</p>
                <p>Wind: ${item.wind.speed} m/s</p>
                <p>Humidity: ${item.main.humidity}%</p>
            </div>
        `;
    });
}

function updateHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('weatherHistory', JSON.stringify(history));
    }
    displayHistory();
}

function displayHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    history.forEach(city => {
        const cityDiv = document.createElement('div');
        cityDiv.className = 'city-history';
        cityDiv.textContent = city;
        cityDiv.addEventListener('click', () => fetchWeather(city));
        historyDiv.appendChild(cityDiv);
    });
}

document.addEventListener('DOMContentLoaded', displayHistory);