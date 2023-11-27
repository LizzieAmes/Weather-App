var apiKey = "5345d6a4a1422ad41c7a77b23fe70eab";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial";
var searchBox = document.querySelector(".search input");
var searchBtn = document.querySelector(".search button");
var weatherIcon = document.querySelector(".weather-icon");
var recentSearchContainer = document.querySelector(".recent-searches");
var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
var currentWeatherIcon = document.querySelector(".current-weather .weather-icon");


function saveRecentSearch(city) {
recentSearches.unshift(city);
localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
updateRecentSearches();
}

function updateRecentSearches() {
  recentSearchContainer.innerHTML = "";
  // Loop through the first 8 items or all items if less than 8
  for (let i = 0; i < Math.min(recentSearches.length, 8); i++) {
    let button = document.createElement("button");
    button.textContent = recentSearches[i];
    button.addEventListener("click", () => checkWeather(recentSearches[i]));
    recentSearchContainer.appendChild(button);
  }
}

async function checkWeather(city) {
  const response = await fetch(`${apiUrl}&q=${city}&appid=${apiKey}`);
  var data = await response.json();

  console.log(data);

  document.querySelector(".city").innerHTML = data.city.name;

  const date = new Date(data.list[0].dt_txt);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); 
  document.querySelector(".date").innerHTML = formattedDate;

  document.querySelector(".temp").innerHTML = "Temp: " + Math.round(data.list[0].main.temp) + "°F"

  document.querySelector(".wind").innerHTML = "Wind: " + data.list[0].wind.speed + " MPH"

  document.querySelector(".humidity").innerHTML = "Humidity: " + data.list[0].main.humidity + "%"

  

  setWeatherIcon(data.list[0].weather[0].main, "weather-icon");
  const next5DaysContainer = document.querySelector(".next-5-days .futuredays");
  next5DaysContainer.innerHTML = ""; // Clear previous content

  for (let i = 1; i <= 5; i++) {
    const dayData = data.list[i * 8 - 1]; 
    const iconId = `weather-icon-${i}`;
    console.log(`Generated ID: ${iconId}`);
    
    const dayDate = new Date(dayData.dt_txt);
    const dayFormattedDate = dayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const dayTemp = "Temperature: " + Math.round(dayData.main.temp) + "°F";
    const dayWind = "Wind: " + dayData.wind.speed + " MPH";
    const dayHumidity = "Humidity: " + dayData.main.humidity + "%";

    // Create a new div to represent each day
    let dayDiv = document.createElement("div");
    dayDiv.classList.add("day");

    let iconElement = document.createElement("img");
    iconElement.classList.add("weather-icon");
    iconElement.id = `weather-icon-${i}`;
    // Update the content for each day
    dayDiv.innerHTML = `
      <h4>${dayFormattedDate}</h4>
      
      <p>${dayTemp}</p>
      <p>${dayWind}</p>
      <p>${dayHumidity}</p>
    `;
    
    setWeatherIcon(data.list[0].weather[0].main, iconId);
    // Append the day div to the container
    next5DaysContainer.appendChild(dayDiv);
  }

  saveRecentSearch(city);

}

function setWeatherIcon(weatherMain, elementId) {
  // Set the weather icon based on the weather condition
  const iconElement = document.getElementById(elementId);

  if (iconElement) {
    switch (weatherMain) {
      case "Rain":
        iconElement.src = "assets/images/rain.png";
        break;
      case "Clouds":
        iconElement.src = "assets/images/clouds.png";
        break;
      case "Clear":
        iconElement.src = "assets/images/clear.png";
        break;
      case "Mist":
        iconElement.src = "assets/images/mist.png";
        break;
      case "Drizzle":
        iconElement.src = "assets/images/drizzle.png";
        break;
      case "Snow":
        iconElement.src = "assets/images/snow.png";
        break;
    }
  } else {
    console.error(`Element with ID '${elementId}' not found.`);
  }
}

searchBtn.addEventListener("click", async ()=>{
  await checkWeather(searchBox.value);
  searchBox.value = "";
});

updateRecentSearches();

