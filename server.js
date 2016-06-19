'use strict';
require('dotenv').config();
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemcachedStore = require('connect-memcached')(session);
var gcloud = require('gcloud');
var bodyParser  = require('body-parser');
var datastore = gcloud.datastore();
var DriverForm = require('./models/driver-form');
var OrganizerForm = require('./models/organizer-form');
var GetUpdatesForm = require('./models/get-updates-form');
var PickupForm = require('./models/pickup-form');
var app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  proxy: 'true',
  store: new MemcachedStore({
    hosts: [process.env.MEMCACHE_URL]
  })
}));

app.get('/', function (req, res, next) {
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
  }
  res.end('Viewed ' + req.session.views + ' times.');
});

app.post('/forms/driver', function (req, res) {
  var form = new DriverForm(req.body);
  form.save().then(function(){
    res.json({success: "success"});
  }, function(){
    res.json({errors: form.errors})
  })
});

app.post('/forms/organizer', function (req, res) {
  var form = new OrganizerForm(req.body);
  form.save().then(function(){
    res.json({success: "success"});
  }, function(){
    res.json({errors: form.errors})
  })
});

app.post('/forms/get_updates', function (req, res) {
  var form = new GetUpdatesForm(req.body);
  form.save().then(function(){
    res.json({success: "success"});
  }, function(){
    res.json({errors: form.errors})
  })
});

app.post('/forms/pickup', function (req, res) {
  var form = new PickupForm(req.body);
  form.save().then(function(){
    res.json({success: "success"});
  }, function(){
    res.json({errors: form.errors})
  })
});

app.listen(process.env.PORT, function () {
  console.log('App listening on port %d', process.env.PORT);
});

module.exports = app;
