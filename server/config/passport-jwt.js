const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('mongoose').model('User');
const config = require('../config/config');

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.JWT_SECRET;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.getUserById(jwt_payload._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, {message: 'user not found.'});
            // or you could create a new account
        }
    });
}));

