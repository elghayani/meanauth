const passport = require('passport'),
    User = require('mongoose').model('User'),
    LocalStrategy = require('passport-local');

const localOptions = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
};
const APIError = require('./APIError');

passport.use('local-login', new LocalStrategy(localOptions, (req, username, password, done) => {
    return User.findOne({username}).then(user => {
        if (!user)  return done(new APIError('User Not Found.', 404, true));
        user.validPassword(password, (err, isMatch)=>{
            if (err) { return done(err); }
            if (!isMatch)  return done(new APIError('wrong Password.', 400, true));
            return done(null, user);
          });
    }).catch(err => { return done(err);  });
} ))

passport.use('local-signup', new LocalStrategy( localOptions, ( req, username, password, done) => {
    return User.findOne({username}).then(user => {
        if (user)  return done(new APIError('that username is already taken.', 404, true));
        let newUser = new User({
            username: username,
            name: req.body.name,
            email: req.body.email
        });
        newUser.setPassword(password);
        newUser.save(function(err) {
            if(err) return done(err);
            else  return done(null, newUser);
        });
    }).catch(err => { return done(err);  });
} ));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.getUserById(id, function(err, user) {
//   done(err, user);
//   });
// });