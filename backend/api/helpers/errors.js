/**
 * Copyright (c) 2018 Glenn Bueno, All rights reserved.
 */

"use strict";

/**
 * Implements error handling
 *
 * @author      BUENOG
 * @version     1.0
 */

const _ = require('lodash');
const debug = require('debug')('node-errors');
const stringify = require('json-stringify-safe');
const util = require('util');

const errors = {
    RESOURCE_NOT_FOUND: {
        code: '1000',
        description: 'Indicates that a resoure is not found on the system.',
    },
    UNKNOWN: {
        code: '1100',
        description: 'Indicates that the error is unexpected and cause is not known.',
    },
    INVALID_REQUEST: {
        code: '1010',
        description: 'Indicates that the error is caused by invalid client parameter or data.',
    },
    API_NOT_SUPPORTED: {
        code: '1020',
        description: 'Error is thrown when some of the API is not yet implemented.',
    },
    AUTH_HEADER_REQUIRED: {
        code: '1030',
        description: 'Error is thrown when authorization header is missing from the request headers.',
    },
    AUTH_TOKEN_INVALID: {
        code: '1040',
        description: 'Error is thrown when access token is invalid.',
    },
    AUTH_TOKEN_EXPIRED: {
        code: '1050',
        description: 'Error is thrown when access token is expired.',
    },
    NOT_PERMITTED: {
        code: '1050',
        description: 'Error is thrown when operation is not permitted by the auth user.',
    },
};
const processed = [];

_.keys(errors).forEach((value) => {
    const single = {};
    single[value] = errors[value].code;
    processed.push(single);
});

/**
 * Common error with message and custom code
 * @param {String} message - error message
 * @param {Number} code    - response status code, defaults to 400
 */
function CommonError(message, statusCode, code) {
    Error.call(this);

    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode || 400;
    this.code = code || errors.UNKNOWN.code;

    return this;
}
util.inherits(CommonError, Error);

/**
 * Bad Request Error
 * @param {*} payload - Error Details
 */
function BadRequestError(payload) {
    CommonError.call(this, 'Bad Request', 400, errors.INVALID_REQUEST.code);
    this.data = payload;
    return this;
}
util.inherits(BadRequestError, CommonError);

/**
 * Authentication Error
 * @param {String} message - defaults to 'Not authorized'
 */
function AuthError(message, code) {
    CommonError.call(this, 'Not authorized', 401, code || errors.AUTH_HEADER_REQUIRED.code);
    return this;
}
util.inherits(AuthError, CommonError);

/**
 * Access Forbidden Error
 * @param {String} message - defaults to `Forbidden`
 */
function ForbiddenError(message) {
    CommonError.call(this, message || 'Forbidden', 403, errors.NOT_PERMITTED.code);
    return this;
}
util.inherits(ForbiddenError, CommonError);

module.exports = {
    Auth: AuthError,
    BadRequest: BadRequestError,
    Common: CommonError,
    Forbidden: ForbiddenError
};