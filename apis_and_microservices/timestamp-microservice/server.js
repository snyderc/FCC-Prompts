// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Can process Unix timestamp strings or YYYY-MM-DD strings (e.g. 2018-05-25)
// The "?" at the end of the :date_string variable means it's an optional parameter
app.get("/api/timestamp/:date_string?", function (req, res) {
  let dateString = req.params.date_string;
  // If Unix timestamp (only digits), multiply by 1000 so JS can parse it (JS in milliseconds, Unix in seconds)
  if (dateString && dateString.match(/^[0-9]*$/)) {
    dateString = dateString * 1000;
  }
  // Uses current date/time if user didn't pass in a value for date_string
  const date = dateString ? new Date(dateString) : new Date();
  res.json(
    {
      "unix": Math.floor(date.getTime()/1000),
      "utc": date.toUTCString()
    }
  );
});

// listen for requests :)
var listener = app.listen(process.env.PORT | 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
