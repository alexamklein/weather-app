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
  let militaryTime = date.getHours();
  if (militaryTime < 12) {
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
  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall";
  let apiUrl = `${apiEndpoint}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
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
  celsiusLink.classList.add("active");
  document.querySelector("#unit-divider").innerHTML = "|";
  document.querySelector("#fahrenheit-link").innerHTML = "°F";
  fahrenheitLink.classList.remove("active");
  celsiusFeelsLike = response.data.main.feels_like;
  document.querySelector("#feels-like").innerHTML = `Feels like: ${Math.round(
    celsiusFeelsLike
  )} °C`;
  getForecast(response.data.coord);
}

function displayCity(city) {
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${unit}`;
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
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(`${apiUrl}`).then(getCityTime);
  axios.get(`${apiUrl}`).then(displayWeatherConditions);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchCurrentLocation);
}

function displayFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let fahrenheitFeelsLike = (celsiusFeelsLike * 9) / 5 + 32;
  let imperialWindSpeed = metricWindSpeed / 1.609;
  document.querySelector("#temperature").innerHTML = Math.round(
    fahrenheitTemperature
  );
  document.querySelector("#feels-like").innerHTML = `Feels like: ${Math.round(
    fahrenheitFeelsLike
  )} °F`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    imperialWindSpeed
  )} mph`;
}

function getFahreinheitForecast(coordinates) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall";
  let apiUrl = `${apiEndpoint}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function getCityCoordinates(response) {
  getFahreinheitForecast(response.data.coord);
}

function getCity(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let city = document.querySelector("#city").innerHTML;
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(getCityCoordinates);
}

function displayCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector("#feels-like").innerHTML = `Feels like: ${Math.round(
    celsiusFeelsLike
  )} °C`;
  document.querySelector("#wind").innerHTML = `Wind: ${Math.round(
    metricWindSpeed
  )} km/h`;
}

function getCelsiusForecast(response) {
  getForecast(response.data.coord);
}

function toggleForecast(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let city = document.querySelector("#city").innerHTML;
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}`;
  axios.get(`${apiUrl}`).then(getCelsiusForecast);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheit);
fahrenheitLink.addEventListener("click", getCity);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsius);
celsiusLink.addEventListener("click", toggleForecast);

let celsiusTemperature = null;
let celsiusFeelsLike = null;
let metricWindSpeed = null;

let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
let apiKey = "6f7fc1e8921ca5e8743c4596d4b381f9";
let unit = "metric";

window.onload = getCurrentLocation;
