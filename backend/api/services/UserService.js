/**
 * Copyright (c) 2017 Glenn Bueno, All rights reserved.
 */

"use strict";

/**
 * Implements the business logic for exposed API's in UserController
 *
 * @author      BUENOG
 * @version     1.0
 */

const _ = require("lodash");
const co = require("co");
const config = require("config");
const Mustache = require('mustache');

const errors = require("../helpers/errors");
const jwt = require("../helpers/jwt");
const models = require("../models");
const utils = require("../helpers/utils");

const sequelize = models.sequelize;
const Sequelize = models.Sequelize;
const User = models.User;

/**
 * Registers a User
 * @param {*} auth Authentication Details
 * @param {*} params Swagger Params
 * @param {*} entity Request Body object
 */
function* register(auth, params, entity) {
    const existingUser = yield User.count({
        where: { username: entity.username }
    });

    if (existingUser > 0) {
        throw new errors.BadRequest("Username already exist.");
    }

    entity.status = "active";
    entity.createdBy = config.role.system;
    entity.updatedBy = config.role.system;
    entity.password = yield utils.hashString(entity.password, 4);

    User.create(entity);
}

/**
 * Retrieves the User details
 * @param {*} auth Authentication Details
 * @param {*} params Swagger Params
 * @param {*} entity Request Body object
 */
function* retrieveUser(auth, params, entity) {
    const user = yield User.findOne({
        where: { id: auth.userId }
    });

    return user;
}

/**
 * Retrieve all Users
 * @param {*} auth Authentication Details
 * @param {*} params Swagger Params
 * @param {*} entity Request Body object
 */
function* retrieveAllUsers(auth, params, entity) {
    const users = User.findAll({ raw: true });

    return users;
}

/**
 * Updates the user information
 * @param {*} auth Authentication Details
 * @param {*} params Swagger Params
 * @param {*} entity Request Body object
 */
function* updateUser(auth, params, entity) {
    entity.updatedBy = config.role.system;

    User.update(entity, {
        where: { id: auth.userId }
    });
}

/**
 * Logins to the system and retrieve access and refresher tokens
 * @param {*} auth Authentication Details
 * @param {*} params Swagger Params
 * @param {*} entity Request Body object
 */
function* login(auth, params, entity) {
    params = _.mapValues(params, function (data) { return data.value });
    const username = entity.username;
    const password = entity.password;

    const user = yield User.findOne({
        where: {
            username: username
        }
    });
    if (!user)
        throw new errors.Auth("Invalid username or password");

    const match = yield utils.compare(password, user.password.toString("utf8"));
    if (!match)
        throw new errors.Auth("Invalid username or password");

    const payload = {
        userId: user.id,
        role: config.role.user
    };

    // Access Token
    var accessToken = jwt.create(payload, config.jwt.SECRET, {
        expiresIn: config.jwt.EXPIRATION_TIME
    });

    // Refresh Token
    var refreshToken = jwt.create(payload, config.jwt.SECRET, {
        expiresIn: config.jwt.EXPIRATION_TIME * 100
    });

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
}

/**
 * POST: /users/refreshtoken
 * Validate the access token and issue a new access token, non-anonymous
 *
 * @param auth the authorized user
 * @param params the parameters for the method
 */
function* refreshToken(auth, params, entity) {
    params = _.mapValues(params, function (v) { return v.value; });
    const accessToken = jwt.refresh(auth.token, config.jwt.SECRET, {
        expiresIn: config.jwt.EXPIRATION_TIME
    });

    return {
        accessToken: accessToken,
        refreshToken: auth.token
    };
}

/**
 * POST: /users/changeforgotpassword
 * Set a new password for a user, the implementation must verify that the reset password token is valid. anonymous
 *
 * @param auth the authorized user
 * @param params the parameters for the method
 */
function* createNewPassword(auth, params, entity) {
    params = _.mapValues(params, function (v) { return v.value; });
    return sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE },
        co.wrap(function* (t) {
            const token = entity.token;
            const password = entity.password;
            const claims = jwt.decode(token, config.JWT_SECRET);
            const userId = claims.userId;

            var user = yield User.findById(userId);
            if (!user) throw new errors.BadRequest("Invalid token");

            user.set("password", yield utils.hashString(password, 4));
            var milliseconds = moment.utc().valueOf();
            user.set("updatedBy", "system");
            user.set("updatedAt", milliseconds);
            yield user.save({ transaction: t });
        })
    ).catch(function (err) {
        throw err;
    });
}

/**
 * POST: /users/forgotpassword
 * Send forgot password email to registered email address, the implementation should validate that a user is registered with the specified email address, anonymous
 *
 * @param auth the authorized user
 * @param params the parameters for the method
 */
function* forgotPassword(auth, params, entity) {
    params = _.mapValues(params, function (v) { return v.value; });
    return sequelize.transaction({ isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE },
        co.wrap(function* (t) {
            const username = entity.username;
            var user = yield User.findOne({
                where: { username: username }
            });

            const payload = { userId: user.id };
            const accessToken = jwt.create(payload, config.jwt.SECRET, {
                expiresIn: config.jwt.EXPIRATION_TIME
            });
            user.resetPasswordToken = accessToken;
            user.save({ transaction: t });

            const txt = config.resetpassword.url;
            const body = Mustache.render(txt, { token: accessToken });
            console.log('###### Refresh #####');
            console.log(body);
        })
    ).catch(function (err) {
        throw err;
    });
}

module.exports = {
    register,
    retrieveUser,
    retrieveAllUsers,
    updateUser,
    login,
    refreshToken,
    forgotPassword,
    createNewPassword
};