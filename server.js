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

// app.post('/forms/organizer', function (req, res) {
//   datastore.save({
//     key: datastore.key('OrganizerForm'),
//     data: {
//       created: new Date().toJSON(),
//       name: req.body.name,
//       email: req.body.email,
//       phone: req.body.phone,
//       city: req.body.city
//     }
//   }, handleDatastoreSave.bind(this, res));
// });

// app.post('/forms/get_updates', function (req, res) {
//   datastore.save({
//     key: datastore.key('GetUpdatesForm'),
//     data: {
//       created: new Date().toJSON(),
//       email: req.body.email,
//     }
//   }, handleDatastoreSave.bind(this, res));
// });

app.listen(process.env.PORT, function () {
  console.log('App listening on port %d', process.env.PORT);
});

module.exports = app;
