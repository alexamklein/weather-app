function formatCityTime(date) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let cityDay = days[date.getDay()];
  let hours = [
    12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11,
  ];
  let cityHour = hours[date.getHours()];
  let cityMinute = date.getMinutes();
  if (cityMinute < 10) {
    cityMinute = `0${cityMinute}`;
  }
  let militaryHour = date.getHours();
  if (militaryHour < 12) {
    amPm = "AM";
  } else {
    amPm = "PM";
  }
  return `${cityDay}, ${cityHour}:${cityMinute} ${amPm}`;
}

function getCityTime(response) {
  let localTime = new Date(response.data.dt * 1000);
  let utcOffset = localTime.getTimezoneOffset() * 60000;
  let utcTime = response.data.dt * 1000 + utcOffset;
  let cityTimestamp = utcTime + response.data.timezone * 1000;
  let cityTime = new Date(cityTimestamp);
  document.querySelector("#day-time").innerHTML = formatCityTime(cityTime);
}

function formatForecastDays(timestamp) {
  let day = new Date(timestamp * 1000);
  let days = day.getDay();
  let forecastDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return forecastDays[days];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastDisplay = document.querySelector("#forecast");
  let forecastHTML = `<div class="forecast row mb-4">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7) {
      forecastHTML += `
      <div class="col-sm forecast-cards">
        <div>
          <div class="card-body">
            <div>${formatForecastDays(forecastDay.dt)}</div>
              <img
                src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt="clear sky"
                class="forecast-icon"
              />
              <div class="forecast-temp">
                <strong>${Math.round(forecastDay.temp.max)}°</strong>
                <span>${Math.round(forecastDay.temp.min)}°</span>
              </div>
          </div>
        </div>
      </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastDisplay.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let units = "metric";
  let apiKey = "6f7fc1e8921ca5e8743c4596d4b381f9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeatherConditions(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  metricWindSpeed = response.data.wind.speed * 3.6;
  document.querySelector("#wind").innerHTML = Math.round(metricWindSpeed);
  document
    .querySelector("#main-weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#main-weather-icon")
    .setAttribute("alt", response.data.weather[0].main);
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  celsiusFeelsLike = response.data.main.feels_like;
  document.querySelector("#feels-like").innerHTML =
    Math.round(celsiusFeelsLike);
  getForecast(response.data.coord);
}

function displayOnLoad(city) {
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "6f7fc1e8921ca5e8743c4596d4b381f9";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(getCityTime);
  axios.get(`${apiUrl}`).then(displayWeatherConditions);
}

function searchCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  displayOnLoad(city);
}

function searchCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "6f7fc1e8921ca5e8743c4596d4b381f9";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(getCityTime);
  axios.get(`${apiUrl}`).then(displayWeatherConditions);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperature.innerHTML = Math.round(fahrenheitTemperature);
}

function displayFahrenheitFeelsLike(event) {
  event.preventDefault();
  let feelsLike = document.querySelector("#feels-like");
  let celsius = document.querySelector("#celsius");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitFeelsLike = (celsiusFeelsLike * 9) / 5 + 32;
  feelsLike.innerHTML = `${Math.round(fahrenheitFeelsLike)} °F`;
  celsius.innerHTML = null;
}

function displayImperialWindSpeed(event) {
  event.preventDefault();
  let windSpeed = document.querySelector("#wind");
  let kmH = document.querySelector("#metric-wind-speed");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let imperialWindSpeed = metricWindSpeed / 1.609;
  windSpeed.innerHTML = `${Math.round(imperialWindSpeed)} mph`;
  kmH.innerHTML = null;
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperature = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperature.innerHTML = Math.round(celsiusTemperature);
}

function displayCelsiusFeelsLike(event) {
  event.preventDefault();
  let feelsLike = document.querySelector("#feels-like");
  let celsius = document.querySelector("#celsius");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  feelsLike.innerHTML = Math.round(celsiusFeelsLike);
  celsius.innerHTML = " °C";
}

function displayMetricWindSpeed(event) {
  event.preventDefault();
  let windSpeed = document.querySelector("#wind");
  let kmH = document.querySelector("#metric-wind-speed");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  windSpeed.innerHTML = Math.round(metricWindSpeed);
  kmH.innerHTML = " km/h";
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;
let celsiusFeelsLike = null;
let metricWindSpeed = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
fahrenheitLink.addEventListener("click", displayFahrenheitFeelsLike);
fahrenheitLink.addEventListener("click", displayImperialWindSpeed);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);
celsiusLink.addEventListener("click", displayCelsiusFeelsLike);
celsiusLink.addEventListener("click", displayMetricWindSpeed);

displayOnLoad("Toronto");
