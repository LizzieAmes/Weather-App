const apiKey = "5345d6a4a1422ad41c7a77b23fe70eab";
const apiUrl = "api.openweathermap.org/data/2.5/forecast?q=london";

async function checkWeather() {
  const response = await fetch(apiUrl + `&appid=${apiKey}`);
  var data = await response.json();

  console.log(data);
}

checkWeather();