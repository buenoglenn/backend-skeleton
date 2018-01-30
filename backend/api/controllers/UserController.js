/**
 * Copyright (c) 2017 Glenn Bueno, All rights reserved.
 */

"use strict";

/**
 * Exposes the API's for User related actions
 *
 * @author      BUENOG
 * @version     1.0
 */

const co = require('co');
const UserService = require('../services/UserService');

/**
 * POST: /register
 * create a user in the application and send confirmation email to the email address specified. The implementations should verify that username, email is unique and the client payload is valid, anonymous
 * 
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Iterator
 */
function register(req, res, next) {
    co(function* () {
        res.json(yield UserService.register(req.auth, req.swagger.params, req.body));
    }).catch(next);
}

/**
 * GET: /user
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Iterator
 */
function retrieveUser(req, res, next) {
    co(function* () {
        res.json(yield UserService.retrieveUser(req.auth, req.swagger.params));
    }).catch(next);
}

/**
 * GET: /users
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Iterator
 */
function retrieveAllUsers(req, res, next) {
    co(function* () {
        res.json(yield UserService.retrieveAllUsers(req.auth, req.swagger.params));
    }).catch(next);
}

/**
 * PUT: /user
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Iterator
 */
function updateUser(req, res, next) {
    co(function* () {
        res.json(yield UserService.updateUser(req.auth, req.swagger.params, req.body));
    }).catch(next);
}

/**
 * POST: /login
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Iterator
 */
function login(req, res, next) {
    co(function* () {
        const userType = req.get('X-User-Type');
        res.json(yield UserService.login(req.auth, req.swagger.params, req.body, userType));
    }).catch(next);
}

/**
 * POST /users/refreshtoken
 * Validate the access token and issue a new access token, non-anonymous
 *
 * @param req the request
 * @param res the response
 * @param next the next step in the middleware flow
 */
function refreshToken(req, res, next) {
    console.log('******* TEST ********');
    console.log(req);
    co(function* () {
        res.json(yield UserService.refreshToken(req.auth, req.swagger.params, req.body));
    }).catch(next);
}

/**
 * POST /users/changeforgotpassword
 * Set a new password for a user, the implementation must verify that the reset password token is valid. anonymous
 *
 * @param req the request
 * @param res the response
 * @param next the next step in the middleware flow
 */
function createNewPassword(req, res, next) {
    co(function* () {
        res.json(yield UserService.createNewPassword(req.auth, req.swagger.params, req.body));
    }).catch(next);
}
/**
 * POST /users/forgotpassword
 * Send forgot password email to registered email address, the implementation should validate that a user is registered with the specified email address, anonymous
 *
 * @param req the request
 * @param res the response
 * @param next the next step in the middleware flow
 */
function forgotPassword(req, res, next) {
    co(function* () {
        res.json(yield UserService.forgotPassword(req.auth, req.swagger.params, req.body));
    }).catch(next);
}

module.exports = {
    register,
    retrieveUser,
    retrieveAllUsers,
    updateUser,
    login,
    refreshToken,
    createNewPassword,
    forgotPassword
};
