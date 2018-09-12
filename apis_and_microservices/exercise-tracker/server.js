const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv').config(); // Allows .env file to be used

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI)

const userSchema = new mongoose.Schema({
  username: String,
  log: [
    {
      description: String,
      duration: Number,
      date: Date
    }
  ]
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(cors())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Add new user to db
app.post('/api/exercise/new-user', (req, res) => {
  // Search db for username
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      res.send('Error');
      console.log(err);
    }
    else {
      // If user object exists, inform user that username is taken
      if (user) {
        res.send("Username already exists");
      }
      // Else user object is blank, so add username to system
      else {
        const u = new User({
          username: req.body.username
        });
        u.save((err, u) => {
          if (err) {
            res.send("Error saving to db");
            console.log("Error saving:", err);
          }
          else {
            res.json({
              username: u.username,
              _id: u.id
            });
          }
        });
      }
    }
  });
});

// Add new exercise log entry to a user in db
app.post('/api/exercise/add', (req, res) => {
  const query = { _id: req.body.userId };
  const updateText = {
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  };
  const updates = { $push: { log: updateText } }
  // Update the user's entry with the updates
  User.findOneAndUpdate(query, updates, (err, doc) => {
    // Invalid userId is one reason for an error here
    if (err) {
      res.send("Error. Is the userId correct?");
      console.log(err);
    }
    else {
      // Return info about what was updated
      res.json({
        username: doc.username,
        description: updateText.description,
        duration: updateText.duration,
        _id: doc._id,
        date: updateText.date
      });
    }
  });
});

app.get('/api/exercise/log', (req, res) => {
  // Query params "from" and "to" converted into Dates
  const fromDate = req.query.from && new Date(req.query.from);
  const toDate = req.query.to && new Date(req.query.to);
  console.log(fromDate, toDate);
  // Check that query includes a userId
  if (req.query.userId) {
    // Look up user in db
    User.findOne({ _id: req.query.userId }, (err, doc) => {
      if (err) {
        res.send("Error");
        console.log(err);
      }
      else {
        // Use the optional parameters to filter the list
        const returnValues = {
          _id: doc._id,
          username: doc.username,
          count: 0,
          log: []
        }
        for (let i = 0; i < doc.log.length; i++) {
          const logItem = doc.log[i];
          let addLogItem = true;
          // Test "limit" param
          if (returnValues.count >= req.query.limit) {
            addLogItem = false;
          }
          // Test "from" param
          if (fromDate && fromDate > logItem.date) {
            addLogItem = false;
          }
          // Test "to" param
          if (toDate && toDate < logItem.date) {
            addLogItem = false;
          }
          // If all tests pass, add logItem to output
          if (addLogItem) {
            returnValues.log.push(logItem);
            returnValues.count += 1;
          }
        }
        res.send(returnValues);
      }
    });
  }
  else {
    res.send("You must provide a userId -- /api/exercise/log?userId=___");
  }
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
