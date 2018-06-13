'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');
const domain = require('getdomain');
const dotenv = require('dotenv').config();
const dns = require('dns');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

// Database for project
mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

const urlSchema = new mongoose.Schema({
  shortId: Number,
  longUrl: String
});

const counterSchema = new mongoose.Schema({
  lastShortId: Number
});

const Url = mongoose.model('Url', urlSchema);
const Counter = mongoose.model('Counter', counterSchema);

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

// Shows homepage
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// Takes in URL submission, saves short URL to webpage, outputs JSON to user per spec
// TODO: Refactor to reduce number of nested callbacks
app.post("/api/shorturl/new", (req, res) => {
  // Add "http://" if missing from submission
  const longUrl = req.body.longUrl.indexOf('http:\/\/') === -1 ? 'http://'.concat(req.body.longUrl) : req.body.longUrl;
  // Look up domain to make sure it's a valid domain. Makes error JSON if invalid domain.
  // Note: Does not check validity of individual page, only whether domain exists.
  const hostname = domain.origin(longUrl);
  dns.lookup(hostname, (err, address) => {
    if (err) {
      res.json({
        "error": "invalid URL"
      });
    }
    else {
       // Take the URL. Store it inside db with a sequential id
      Counter.findOne({}, (err, counter) => {
        if (err) {
          console.log(err);
        }
        else {
          if (!counter) {
            const newShortId = 1;
            Counter.create({
              lastShortId: newShortId
            });
            Url.create({
              shortId: newShortId,
              longUrl
            });
            res.json({
              "original_url": longUrl,
              "short_url": newShortId
            });
          }
          else {
            const newShortId = counter.lastShortId + 1;
            Url.create({
              shortId: newShortId,
              longUrl
            }, (err, url) => {
              if (err) {
                console.log(err);
              }
              else {
                counter.set({
                  lastShortId: newShortId
                });
                counter.save((err, updatedCounter) => {
                  res.json({
                    "original_url": longUrl,
                    "short_url": newShortId
                  });
                });
              }
            });
          }
        }
      });
    }
  });
});

// Redirects user to the long URL corresponding with the given short ID
app.get("/api/shorturl/:id", (req, res) => {
  // Get ID from db and then redirect to appropriate site
  const shortId = req.params.id;
  Url.findOne({ shortId }, (err, url) => {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect(url.longUrl);
    }
  });
});

app.listen(port, function () {
  console.log(`Node.js listening on port ${port}`);
});