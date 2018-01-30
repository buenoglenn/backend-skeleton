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

module.exports = {
    register,
    retrieveUser,
    retrieveAllUsers,
    updateUser,
    login
};
