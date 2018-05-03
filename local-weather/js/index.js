/* General TODO list:
- Implement zip code field with conversion to lat/long so user can specify a new location
*/

// Asynchronous function to obtain user position and display local weather
function navigationSuccess(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
  displayWeather(lat, lon);

/* Debug mode: Kingston, RI weather
  lat = 41.5249425;
  lon = -71.5203475;
  displayWeather(lat, lon);
*/
}

// Set to NYC weather by default if user's location not available.
// TODO: Implement case where neither success or failure are returned.
function navigationFailure(err) {
  lat = 40.714224;
  lon = -73.961452;
  displayWeather(lat, lon);
}

function displayWeather(lat, lon) {
  var weatherAPI = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`;

  // console.log(lat);
  // console.log(lon);
  // console.log(weatherAPI);

  // Get the user's weather and display it
  $.getJSON(weatherAPI, function(json) {
    // console.log(json);
    // Outputs location
    $("#location").html(`for ${json.name}`);

    // Loops through array of weather conditions and outputs them
    var conditionsHTML = "";
    for (var i = 0; i < json.weather.length; i++) {
      conditionsHTML += json.weather[i].main;
      if (i < json.weather.length - 1) { conditionsHTML += "/"; }
    }

    // Loops through array of icons and outputs them
    var iconHTML = "";
    for (var i = 0; i < json.weather.length; i++) {
      if (json.weather[i].hasOwnProperty("icon")) {
        // TODO: Implement alt text.
        // Alt text loads before icon does, I've noticed.
        iconHTML += `<img src="${validateIconURL(json.weather[i].icon)}">`
      }
    }

    // Outputs to HTML both the icon and the text conditions
    $("#conditions").html(`${iconHTML} ${conditionsHTML}`);

    // Outputs temperature. API gives it in Celsius.
    var temperaInteger = `${Math.round(json.main.temp)}`;
    $("#currentTemp").html(`${temperaInteger}`);
    $("#degreesC").removeAttr("hidden");
    $("#degreesF").removeAttr("hidden");



  });
}

/*
  The API sometimes returns a 3-char string for icon
  instead of a full URL. This function checks and rectifies.
*/
function validateIconURL(url) {
  // If url is only 3 characters long, then it needs to be wrapped
  // https://cdn.glitch.com/6e8889e5-7a72-48f0-a061-863548450de5%2F${url}.png
  if (url.length === 3) {
    url = `https://cdn.glitch.com/6e8889e5-7a72-48f0-a061-863548450de5%2F${url}.png`
  }
  return url;
}



// Converts Celsius to Farenheit and outputs F as active
function cToF() {
  // If degreesC button was previously active:
  console.log("cToF before if");
  if ($("#degreesC").hasClass("active")) {
    console.log("cToF inside if");
    var tempInC = $("#currentTemp").html();
    var tempInF = Math.round(tempInC * 1.8 + 32);
    $("#currentTemp").html(tempInF);
    $("#degreesC").removeClass("active");
    $("#degreesC").removeAttr("aria-pressed");
    $("#degreesF").addClass("active");
    $("#degreesF").attr("aria-pressed", "true");
  }
  // Else, if degreesF button is currently active, do nothing
}

// Converts Farenheit to Celsius and outputs C as active
function fToC() {
  // If degreesF button was previously active:
  console.log("fToC before if");
  if ($("#degreesF").hasClass("active")) {
    console.log("fToC inside if");
    var tempInF = $("#currentTemp").html();
    var tempInC = Math.round((tempInF - 32) / 1.8);
    $("#currentTemp").html(tempInC);
    $("#degreesF").removeClass("active");
    $("#degreesF").removeAttr("aria-pressed");
    $("#degreesC").addClass("active");
    $("#degreesC").attr("aria-pressed", "true");
  }
// Else, if degreesC button is currently active, do nothing
}


$(document).ready(function() {

  // First, determine the location for which you'll be showing weather.
  var lat;
  var lon;

  // If geolocation is available, pull user's location
  if (navigator.geolocation) {
    // Asynchronous function to get geolocation
    navigator.geolocation.getCurrentPosition(navigationSuccess, navigationFailure);
  }
  else {
    // navigationFailure();
  }


  // Handles clicking of the Celsius/Farenheit buttons to convert temperature

  $("#degreesC").on("click", fToC);
  $("#degreesF").on("click", cToF);


});
