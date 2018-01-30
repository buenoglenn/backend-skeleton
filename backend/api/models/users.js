/**
 * Copyright (c) 2017 Glenn Bueno, All rights reserved.
 */

"use strict";

/**
 * Users Model
 *
 * @author      BUENOG
 * @version     1.0
 */

const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('users', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            field: 'id'
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'last_name'
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'gender'
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'dob'
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'email'
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'username'
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'status'
        },
        password: {
            type: 'BINARY',
            allowNull: false,
            field: 'password'
        },
        contactNo: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'contact_no'
        },
        resetPasswordToken: {
            type: 'BINARY',
            allowNull: true,
            field: 'reset_password_token'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'updated_at'
        },
        createdBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'created_by'
        },
        updatedBy: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'updated_by'
        }
    }, {
            tableName: 'users',
            freezeTableName: true,
            timestamp: false,
            hooks: {
                beforeCreate: function (instance, options) {
                    const now = moment().format('YYYY-MM-DD hh:mm:ss');
                    if (!instance.createdAt) instance.createdAt = now;
                    if (!instance.updatedAt) instance.updatedAt = now;
                },
                beforeUpdate: function (instance, options) {
                    const now = moment().format('YYYY-MM-DD hh:mm:ss');
                    if (!instance.updatedAt) instance.updatedAt = now;
                }
            }
        });
};
