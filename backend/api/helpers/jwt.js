/**
 * Copyright (c) 2018 Glenn Bueno, All rights reserved.
 */

"use strict";

/**
 * A module to list all the api error codes with proper description
 *
 * @author      BUENOG
 * @version     1.0
 */

const errors = require('./errors');

const _ = require('lodash');
const config = require('config');
const jwt = require('jsonwebtoken');
const moment = require('moment');

/**
 * Check token if authorized
 * @param {*} req 
 * @param {*} authOrSecDef 
 * @param {*} scopesOrApiKey 
 * @param {*} cb 
 */
const authorize = function (req, authOrSecDef, scopesOrApiKey, cb) {
  const authorizationHeader = scopesOrApiKey || `Bearer ${req.query.token}`;

  if (!authorizationHeader)
    return cb(new errors.Auth('No Authorization header specified'));
  const splitted = authorizationHeader.split(' ');
  if (splitted.length !== 2 || splitted[0] !== 'Bearer') {
    return cb(new errors.Auth('Invalid Authorization header specified'));
  }

  const userType = req.get('X-User-Type');

  const claims = jwt.decode(splitted[1], config.JWT_SECRET);
  if (!claims)
    return cb(new errors.Auth('Invalid Authorization header specified'));

  const unix = moment().unix();
  if (unix >= claims.exp)
    return cb(new errors.Auth('Access token is expired'));

  if (userType == 'appuser' && (claims.role == config.roles.SUPER_ADMIN || claims.role == config.roles.ADMIN))
    return cb(new errors.Forbidden('Trying to access the user API as an admin'));
  if (userType == 'admin' && (claims.role != config.roles.SUPER_ADMIN && claims.role != config.roles.ADMIN))
    return cb(new errors.Forbidden('Trying to access the admin API as an user'));

  let roleAccess = true;
  let permissionAccess = true;

  var accessControl = req.swagger.operation['x-access-control'] || {};
  accessControl.permissions = accessControl.permissions || [];

  if (accessControl.role)
    if (_.isString(accessControl.role)) {
      if (accessControl.role !== claims.role)
        roleAccess = false;
    } else {
      if (!_.includes(accessControl.role, claims.role))
        roleAccess = false;
    }

  req.auth = {
    token: splitted[1],
    userId: claims.userId,
    role: claims.role,
    permissions: claims.permissions,
  };
  cb();
};

/**
 * Create a JWT's Access and Refresh Tokens
 * @param {*} payload 
 * @param {*} secretOrPrivateKey 
 * @param {*} options 
 */
const create = function (payload, secretOrPrivateKey, options) {
  secretOrPrivateKey = secretOrPrivateKey || config.jwt.SECRET;
  options = options || {};
  options.expiresIn = options.expiresIn || config.jwt.EXPIRATION_TIME;
  return jwt.sign(payload, secretOrPrivateKey, options);
};

/**
 * Refreshes the token
 * @param {*} token 
 * @param {*} secretOrPrivateKey 
 * @param {*} options 
 */
const refresh = function (token, secretOrPrivateKey, options) {
  var limitDate, payload;
  limitDate = void 0;
  payload = void 0;
  secretOrPrivateKey = secretOrPrivateKey || config.jwt.SECRET;
  options = options || {};
  try {
    payload = jwt.decode(token, secretOrPrivateKey);
  } catch (error) {
    return new jwt.JsonWebTokenError('invalid token');
  }
  if (typeof payload.exp !== 'undefined') {
    limitDate = new Date(payload.exp * 1000);
    limitDate.setDate(limitDate.getDate() + 7);
    if (Math.floor(Date.now() / 1000) >= Math.floor(limitDate / 1000)) {
      return new jwt.TokenExpiredError('jwt expired', new Date(payload.exp * 1000));
    } else {
      return jwt.sign(_.omit(payload, 'exp'), config.jwt.SECRET, options);
    }
  } else {
    return token;
  }
};

module.exports = {
  authorize: authorize,
  create: create,
  refresh: refresh,
  decode: jwt.decode
};

