"use strict";

module.exports = {
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
    PORT: process.env.PORT || 3500,
    db: {
        url: {
            local: 'mysql://root:root@127.0.0.1:3306/ema'
        },
        logging: console.log,
    },
    jwt: {
        SECRET: 'h3ll0cB4',
        EXPIRATION_TIME: 1 * 24 * 60 * 60 // 1 day token expiration
    },
    role: {
        system: 'SYSTEM',
        user: 'user'
    }
};
