const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const APIError = require('../config/APIError');

const requiredFieldError = new APIError('All fields required', 400, true);


function authenticate(req, res, user){
    req.login(user, {session: false}, (err) => {
        if (err) {
         return res.status(err.status).send({message : err.message});
        }
        const token = jwt.sign(user.toJSON(), config.JWT_SECRET, { expiresIn:604800 });
        return res.json({
            message: 'Logged In Successfully.',
            token : 'bearer '+token,
            user:{
                id:user._id,
                name : user.name,
                username : user.username,
                email : user.email
            }
        });
    });
}

module.exports.signup = function(req, res, next) {
    if(!req.body.username || !req.body.password || !req.body.email) {
        return res.status(requiredFieldError.status).send({message : requiredFieldError.message});
    }
    passport.authenticate('local-signup', (err, user) => {
        if (err) return res.status(err.status).send({message : err.message});
        else if(!user)  return res.status(400).send({ message :  'Failed to register' });
        authenticate(req, res, user);
    })(req, res);
};

module.exports.login = function(req, res, next) {
   
    if(!req.body.username || !req.body.password) {
        return res.status(requiredFieldError.status).send({message : requiredFieldError.message});
    }
    passport.authenticate('local-login', {session : false}, (err, user) => {
        if (err)  return res.status(err.status).send({message : err.message});
        else if(!user)  res.status(400).send({message : 'User Not Found' });
        authenticate(req, res, user);
    })(req, res);
};

module.exports.logout = function(req){
    req.logout();
}