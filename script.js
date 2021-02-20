const weatherDayIcons = {
  Rain: "wi wi-day-rain",
  Clouds: "wi wi-day-cloudy",
  Clear: "wi wi-day-sunny",
  Snow: "wi wi-day-snow",
  Mist: "wi wi-day-fog",
  Fog: "wi wi-day-fog",
  Drizzle: "wi wi-day-sleet",
  Thunderstorm: "wi wi-day-thunderstorm",
};

const weatherNightIcons = {
    Rain: "wi wi-night-alt-rain",
    Clouds: "wi wi-night-alt-cloudy",
    Clear: "wi wi-night-clear",
    Snow: "wi wi-night-alt-snow",
    Mist: "wi wi-night-fog",
    Fog: "wi wi-night-fog",
    Drizzle: "wi wi-night-alt-sleet",
    Thunderstorm: "wi wi-night-thunderstorm",
  };

  const timeOfDay = {
    0: "wi wi-time-12",
    1: "wi wi-time-1",
    2: "wi wi-time-2",
    3: "wi wi-time-3",
    4: "wi wi-time-4",
    5: "wi wi-time-5",
    6: "wi wi-time-6",
    7: "wi wi-time-7",
    8: "wi wi-time-8",
    9: "wi wi-time-9",
    10: "wi wi-time-10",
    11: "wi wi-time-11",
    12: "wi wi-time-12",
    13: "wi wi-time-1",
    14: "wi wi-time-2",
    15: "wi wi-time-3",
    16: "wi wi-time-4",
    17: "wi wi-time-5",
    18: "wi wi-time-6",
    19: "wi wi-time-7",
    20: "wi wi-time-8",
    21: "wi wi-time-9",
    22: "wi wi-time-10",
    23: "wi wi-time-11",
  };

  let fuseau;
  let sunRise;
  let sunSet;
  let timezone;
  let soleil;
  let h;

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

async function main(withIP = true) {
  let ville;

  if (withIP) {
    // 1. Chopper l'adresse IP du PC qui ouvre la page
    // 2. Chopper la ville grâce à l'adresse IP (ipdata fait l'IP et la ville en même temps)

    ville = await fetch(
      "https://api.ipdata.co?api-key=603aa383668c53e33179236aa87c6287b0e2bfa40b13e5e1e6552198"
    )
      .then((resultat) => resultat.json())
      .then((json) => json.city);
  } else {
    ville = document.querySelector("#ville").textContent;
  }

  // 3. Choper les infos météos grâce à la ville

  const meteo = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=27e9fc5f2daa8e2983c4c94736a4dfa8&lang=fr&units=metric`
  )
    .then((resultat) => resultat.json())
    .then((json) => json);

    const lat = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=27e9fc5f2daa8e2983c4c94736a4dfa8&lang=fr&units=metric`
    )
      .then((resultat) => resultat.json())
      .then((json) => json.coord.lat);

      const lon = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=27e9fc5f2daa8e2983c4c94736a4dfa8&lang=fr&units=metric`
      )
        .then((resultat) => resultat.json())
        .then((json) => json.coord.lon);
      
      // sunRise = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=27e9fc5f2daa8e2983c4c94736a4dfa8&lang=fr&units=metric`
      // )
      //   .then((resultat) => resultat.json())
      //   .then((json) => json.sys.sunrise);
      //   console.log(sunRise);

      // sunSet = await fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=27e9fc5f2daa8e2983c4c94736a4dfa8&lang=fr&units=metric`
      // )
      //   .then((resultat) => resultat.json())
      //   .then((json) => json.sys.sunset);
      //   console.log(sunSet);

      fuseau = await fetch (
        `https://api.ipgeolocation.io/timezone?apiKey=fd7b0a6cc862485890a7bea54f639036&lat=${lat}8&long=${lon}&lang=fr`
      )
      .then((resultat) => resultat.json())
      .then((json) => json.date_time);

      soleil = await fetch (
        `https://api.ipgeolocation.io/timezone?apiKey=fd7b0a6cc862485890a7bea54f639036&lat=${lat}8&long=${lon}&lang=fr`
      )
      .then((resultat) => resultat.json())
      .then((json) => json.date_time_unix);

  // 4. Afficher les infos sur la page

  displayWeatherInfos(meteo);
}

function showTime(){
  let date = new Date(fuseau);
  h = date.getHours(); // 0 - 23
  let m = date.getMinutes(); // 0 - 59
  // let s = date.getSeconds(); // 0 - 59
  // let j = date.getDay();
  // let month = date.getMonth();
  // let y = date.getFullYear();

  h = (h < 10) ? "0" + h : h ;
  m = (m < 10) ? "0" + m : m ;
  // s = (s < 10) ? "0" + s : s ;
  // j = (j < 10) ? "0" + j : j ;
  // month = (month < 10) ? "0" + month : month ;
  
  let time = "Il est " + h + ":" + m + " ";

  document.getElementById("MyClockDisplay").innerText = time;
  document.getElementById("MyClockDisplay").textContent = time;

  document.querySelector("#time").className = timeOfDay[h];
  
  setTimeout(showTime, 1000);
  
}

function displayWeatherInfos(data) {
  const name = data.name;
  const temperature = data.main.temp;
  const conditions = data.weather[0].main;
  const description = data.weather[0].description;
  sunRise = data.sys.sunrise;
  sunSet = data.sys.sunset;
  timezone = data.timezone/3600-1;


  document.querySelector("#ville").textContent = name;
  document.querySelector("#town").textContent = "à " + name;
  document.querySelector("#temperature").textContent = Math.round(temperature);
  document.querySelector("#conditions").textContent = capitalize(description);

  if (sunRise < soleil && soleil < sunSet) {
  document.querySelector("i.wi").className = weatherDayIcons[conditions];
  } else { 
  document.querySelector("i.wi").className = weatherNightIcons[conditions];
  }

  if (timezone !== 0 && timezone !== 1 && timezone !== -1){
    if(timezone >= 0){
      document.querySelector("#timezone").textContent = "+" + timezone + " heures";
    } else {
      document.querySelector("#timezone").textContent = timezone + " heures";
    }
  } else if (timezone >= 0) {
  document.querySelector("#timezone").textContent = "+" + timezone + " heure";
  } else {
    document.querySelector("#timezone").textContent = timezone + " heure";
  }


  document.body.className = conditions.toLowerCase();

}

showTime();

const ville = document.querySelector("#ville");

ville.addEventListener("click", () => {
  ville.contentEditable = true;
});

ville.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    ville.contentEditable = false;
    main(false);
  }
});


main();
