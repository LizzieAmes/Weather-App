var apiKey = "5345d6a4a1422ad41c7a77b23fe70eab";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial";
var searchBox = document.querySelector(".search input");
var searchBtn = document.querySelector(".search button");
var recentSearchContainer = document.querySelector(".recent-searches");
var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// Saves recent searches
function saveRecentSearch(city) {
  recentSearches.unshift(city);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  updateRecentSearches();
}

function updateRecentSearches() {
  recentSearchContainer.innerHTML = "";
  // Loop through the first 10 items or all items if less than 10
  for (let i = 0; i < Math.min(recentSearches.length, 10); i++) {
    let button = document.createElement("button");
    button.textContent = recentSearches[i];
    button.addEventListener("click", () => checkWeather(recentSearches[i]));
    recentSearchContainer.appendChild(button);
  }
}

async function checkWeather(city) {
  var response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
  var data = await response.json();


  document.querySelector(".city").innerHTML = data.city.name;
  
  var date = new Date(data.list[0].dt_txt);
  var formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  document.querySelector(".date").innerHTML = formattedDate;

  document.querySelector(".temp").innerHTML = "Temp: " + Math.round(data.list[0].main.temp) + "°F";
  document.querySelector(".wind").innerHTML = "Wind: " + data.list[0].wind.speed + " MPH";
  document.querySelector(".humidity").innerHTML = "Humidity: " + data.list[0].main.humidity + "%";

  // Display weather icon based on weather condition
  if (data.list[0].weather[0].main == "Rain") {
    document.querySelector("#current-weather-icon").src = "assets/images/rain.png";
  } else if (data.list[0].weather[0].main == "Clouds") {
    document.querySelector("#current-weather-icon").src = "assets/images/clouds.png";
  } else if (data.list[0].weather[0].main == "Clear") {
    document.querySelector("#current-weather-icon").src = "assets/images/clear.png";
  } else if (data.list[0].weather[0].main == "Mist") {
    document.querySelector("#current-weather-icon").src = "assets/images/mist.png";
  } else if (data.list[0].weather[0].main == "Drizzle") {
    document.querySelector("#current-weather-icon").src = "assets/images/drizzle.png";
  } else if (data.list[0].weather[0].main == "Snow") {
    document.querySelector("#current-weather-icon").src = "assets/images/snow.png";
  }

  // Display the next 5 days of forecast
  for (let i = 0; i < 5; i++) {
    var date = new Date(data.list[i * 8].dt_txt); 
    var formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Display forecast information for each day
    document.querySelector(`.date-${i}`).innerHTML = formattedDate;
    document.querySelector(`.temp-${i}`).innerHTML = "Temp: " + Math.round(data.list[i * 8].main.temp) + "°F";
    document.querySelector(`.wind-${i}`).innerHTML = "Wind: " + data.list[i * 8].wind.speed + " MPH";
    document.querySelector(`.humidity-${i}`).innerHTML = "Humidity: " + data.list[i * 8].main.humidity + "%";

    // Display weather icon based on weather condition
    if (data.list[i * 8].weather[0].main == "Rain") {
      document.querySelector(`.weather-icon-${i}`).src = "assets/images/rain.png";
    } else if (data.list[i * 8].weather[0].main == "Clouds") {
      document.querySelector(`.weather-icon-${i}`).src = "assets/images/clouds.png";
    } else if (data.list[i * 8].weather[0].main == "Clear") {
      document.querySelector(`.weather-icon-${i}`).src = "assets/images/clear.png";
    } else if (data.list[i * 8].weather[0].main == "Mist") {
      document.querySelector(`.weather-icon-${i}`).src = "assets/images/mist.png";
    } else if (data.list[i * 8].weather[0].main == "Drizzle") {
      document.querySelector(`.weather-icon-${i}`).src = "assets/images/drizzle.png";
    } else if (data.list[i * 8].weather[0].main == "Snow") {
      document.querySelector(`.weather-icon-${i}`).src = "assets/images/snow.png";
    }
  }

  saveRecentSearch(city);
}

searchBtn.addEventListener("click", async () => {
  await checkWeather(searchBox.value);
  searchBox.value = "";
});

updateRecentSearches();