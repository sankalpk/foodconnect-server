'use strict';

require('dotenv').config();
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MemcachedStore = require('connect-memcached')(session);

var app = express();

app.use(cookieParser());
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
  res.json({
    data:{
      message: "Driver form submitted"
    }
  });
});

app.listen(process.env.PORT, function () {
  console.log('App listening on port %d', process.env.PORT);
});

module.exports = app;
