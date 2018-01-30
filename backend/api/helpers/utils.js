/**
 * Copyright (c) 2017 Glenn Bueno, All rights reserved.
 */

'use strict';

/**
 * Utility script
 *
 * @author      BUENOG
 * @version     1.0
 */

const bcrypt = require('bcryptjs');

/**
 * 
 * @param {*} text 
 * @param {*} rounds 
 */
function* hashString(text, rounds) {
    return yield bcrypt.hash(text, rounds, null);
}

/**
 * 
 * @param {*} hashed 
 * @param {*} to 
 */
function* compare(hashed, to) {
    return yield bcrypt.compare(hashed, to);
}

module.exports = {
    hashString,
    compare
};
