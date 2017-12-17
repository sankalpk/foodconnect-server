'use strict';
require('dotenv').config();
var express = require('express');
var cors = require('cors')
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

app.use(cors());
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

var modelSave = function(req, res, model){
  var form = new model(req.body);
  form.save().then(function(){
    res.json({success: "success"});
  }, function(){
    res.status(400);
    res.json({errors: form.errors});
  })
}

app.post('/forms/driver', function (req, res) {
  modelSave(req,res, DriverForm);
});

app.post('/forms/organizer', function (req, res) {
  modelSave(req,res, OrganizerForm);
});

app.post('/forms/get_updates', function (req, res) {
  modelSave(req,res, GetUpdatesForm);
});

app.post('/forms/pickup', function (req, res) {
  modelSave(req,res,PickupForm);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log('App listening on port %d', process.env.PORT);
});

module.exports = app;
