/**
 * Copyright (c) 2017 DXC Tecnology, All rights reserved.
 *
 * @author      BUENOG
 * @version     1.0
 */

'use strict';

const jwt = require('./api/helpers/jwt');
const path = require('path');

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
app.use(require('express').static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

module.exports = app;

var config = {
  appRoot: __dirname,
  swaggerSecurityHandlers: {
    jwt: jwt.authorize
  }
};

SwaggerExpress.create(config, function (err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
});
