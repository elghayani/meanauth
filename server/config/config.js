const config = {
    SERVER_ENV: process.env.NODE_ENV || 'development',
    SERVER_PORT: process.env.NODE_ENV || 3001,
    JWT_SECRET: 'JWT_SECRET',
    MONGO_HOST : /*'mongodb://user-Meteor:meteor-2017-2018@54.37.86.36:52005/',*/'mongodb://localhost:27017/',
    Mongo_DB: /*'goldenBook?authSource=admin'*/'meanauth'
};

module.exports = config;