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
  let cityTimeStamp = utcTime + response.data.timezone * 1000;
  let cityTime = new Date(cityTimeStamp);
  document.querySelector("#day-time").innerHTML = formatCityTime(cityTime);
}

function displayWeatherConditions(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#weather-description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document
    .querySelector("#main-weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#main-weather-icon")
    .setAttribute("alt", response.data.weather[0].main);
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );
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

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentLocation);

displayOnLoad("Toronto");
