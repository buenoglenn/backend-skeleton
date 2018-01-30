/**
 * Copyright (c) 2017 Glenn Bueno, All rights reserved.
 */

'use strict';

/**
 * Entry point script for the models
 *
 * @author      BUENOG
 * @version     1.0
 */

const config = require('config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.db.url.local, {
    omitNull: true,
    underscored: true,
    logging: config.db.logging,
    define: {
        timestamps: false
    }
});

const UserFunction = require('./users');
const User = UserFunction(sequelize, Sequelize.DataTypes);

module.exports = {
    User,
    sequelize,
    Sequelize
};