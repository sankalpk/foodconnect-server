'use strict';

require('dotenv').config();
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemcachedStore = require('connect-memcached')(session);
var gcloud = require('gcloud');
var bodyParser  = require('body-parser');
var datastore = gcloud.datastore();

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
  datastore.save({
    key: datastore.key('DriverForm'),
    data: {
      created: new Date().toJSON(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    }
  }, function (err) {
    if (err) {
      res.status(400);
      res.json({data:{message: "Error. Driver form not submitted"}});
    } else {
      res.json({data:{message: "Success. Driver form submitted"}});
    }
  });
});

app.post('/forms/organizer', function (req, res) {
  datastore.save({
    key: datastore.key('OrganizerForm'),
    data: {
      created: new Date().toJSON(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city
    }
  }, function (err) {
    if (err) {
      res.status(400);
      res.json({data:{message: "Error. Organizer form not submitted"}});
    } else {
      res.json({data:{message: "Success. Organizer form submitted"}});
    }
  });
});

app.post('/forms/get_updates', function (req, res) {
  datastore.save({
    key: datastore.key('GetUpdatesForm'),
    data: {
      created: new Date().toJSON(),
      email: req.body.email,
    }
  }, function (err) {
    if (err) {
      res.status(400);
      res.json({data:{message: "Error. Get updates form not submitted"}});
    } else {
      res.json({data:{message: "Success. Get updates form submitted"}});
    }
  });
});

app.listen(process.env.PORT, function () {
  console.log('App listening on port %d', process.env.PORT);
});

module.exports = app;
