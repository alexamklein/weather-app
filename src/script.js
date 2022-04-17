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
  return `${cityDay}, ${cityHour}:${cityMinute} ${amPm}, `;
}

function getCityTime(response) {
  let localTime = new Date(response.data.dt * 1000);
  let utcOffset = localTime.getTimezoneOffset() * 60000;
  let utcTimestamp = response.data.dt * 1000 + utcOffset;
  let cityTimestamp = utcTimestamp + response.data.timezone * 1000;
  let cityTime = new Date(cityTimestamp);
  document.querySelector("#day-time").innerHTML = formatCityTime(cityTime);
}

function displayForecast(response) {
  let forecastDisplay = document.querySelector("#forecast");
  let forecast = response.data.daily;
  let timezoneOffset = response.data.timezone_offset * 1000;
  let forecastHTML = `<div class="forecast row mb-4">`;
  forecast.forEach(function (forecastDay, index) {
    let localTime = new Date(forecastDay.dt * 1000);
    let utcOffset = localTime.getTimezoneOffset() * 60000;
    let utcTimestamp = forecastDay.dt * 1000 + utcOffset;
    let cityTimestamp = utcTimestamp + timezoneOffset;
    let cityTime = new Date(cityTimestamp);
    let cityDay = cityTime.getDay();
    let forecastDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let cityDays = forecastDays[cityDay];
    if (index == 0) {
      forecastHTML += `<div class="col-sm forecast-cards">
        <div class="card today-forecast">
          <div class="card-body">
            <div>${cityDays}</div>
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
    if (index > 0 && index < 7) {
      forecastHTML += `<div class="col-sm forecast-cards">
        <div>
          <div class="card-body">
            <div>${cityDays}</div>
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
  document.querySelector("#city").innerHTML = `${response.data.name}, `;
  document.querySelector("#country-code").innerHTML = response.data.sys.country;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].main;
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%, `;
  metricWindSpeed = response.data.wind.speed * 3.6;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    metricWindSpeed
  )} km/h`;
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
  document.querySelector("#celsius-link").innerHTML = "°C";
  document.querySelector("#unit-divider").innerHTML = "|";
  document.querySelector("#fahrenheit-link").innerHTML = "°F";
  celsiusFeelsLike = response.data.main.feels_like;
  document.querySelector("#feels-like").innerHTML = `Feels like: ${Math.round(
    celsiusFeelsLike
  )} °C`;
  getForecast(response.data.coord);
}

function displayCity(city) {
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
  displayCity(city);
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
  feelsLike.innerHTML = `Feels like: ${Math.round(fahrenheitFeelsLike)} °F`;
}

function displayImperialWindSpeed(event) {
  event.preventDefault();
  let windSpeed = document.querySelector("#wind");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let imperialWindSpeed = metricWindSpeed / 1.609;
  windSpeed.innerHTML = `Wind: ${Math.round(imperialWindSpeed)} mph`;
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
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  feelsLike.innerHTML = `Feels like: ${Math.round(celsiusFeelsLike)} °C`;
}

function displayMetricWindSpeed(event) {
  event.preventDefault();
  let windSpeed = document.querySelector("#wind");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  windSpeed.innerHTML = `Wind: ${Math.round(metricWindSpeed)} km/h`;
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

window.onload = getCurrentLocation;
