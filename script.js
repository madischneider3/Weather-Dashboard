const apiKey = 'bf49e5c62b6692cfe3892fbd43ec9d04';
const cityForm = document.querySelector('#city-form');
const currentWeatherContainer = document.querySelector('.current-weather');
const forecastContainer = document.querySelector('.forecast');

function cityFormSubmit(event) {
  event.preventDefault();

  const cityInput = document.querySelector('#city-input');
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}`;

  fetch(apiUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      const temp = Math.round((data.main.temp - 273.15) * 9/5 + 32); // Convert temperature to Fahrenheit
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const weatherIcon = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      const description = data.weather[0].description;
      const city = data.name;

      currentWeatherContainer.innerHTML = `
        <h2>Current Weather for ${city}</h2>
        <img src="${weatherIcon}" alt="${description}">
        <p>Temperature: ${temp}°F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} mph</p>
      `;
      const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput.value}&appid=${apiKey}`;
      fetch(forecastApiUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          const forecastData = data.list;

          forecastContainer.innerHTML = '';
          for (let i = 0; i < forecastData.length; i += 8) {
            const day = forecastData[i];
            const date = new Date(day.dt_txt);
            const temp = Math.round((day.main.temp - 273.15) * 9/5 + 32); // Convert temperature to Fahrenheit
            const weatherIcon = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
            const description = day.weather[0].description;

            forecastContainer.innerHTML += `
              <div class="day">
                <h2>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h2>
                <img src="${weatherIcon}" alt="${description}">
                <p>Temperature: ${temp}°F</p>
                <p>${description}</p>
              </div>
            `;
          }
        })
        .catch(function(error) {
          forecastContainer.innerHTML = `<p>${error.message}</p>`;
        });
    })
    .catch(function(error) {
      currentWeatherContainer.innerHTML = `<p>${error.message}</p>`;
    });
}

cityForm.addEventListener('submit', cityFormSubmit);
