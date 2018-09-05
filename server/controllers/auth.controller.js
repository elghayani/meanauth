const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function authenticate(req, res, user){
    req.login(user, {session: false}, (err) => {
        if (err) {
         return res.status(400).json({success: false, msg:'Failed to login'});
        }
        const token = jwt.sign(user.toJSON(), config.JWT_SECRET, { expiresIn:604800 });
        return res.json({
            success : true,
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

module.exports.signup = function(req, res) {
    if(!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).json({success : false, msg: 'All fields required'});
    }
    passport.authenticate('local-signup', (err, user, info) => {
        if (err || !user) {
           return res.status(400).json({success:false, msg: info ? info.message : 'Failed to register' });
        }
        authenticate(req, res, user);
    })(req, res);
};

module.exports.login = function(req, res) {
   
    if(!req.body.username || !req.body.password) {
       return res.status(400).json({success : false, msg: 'All fields required'});
    }
    passport.authenticate('local-login', {session : false}, (err, user, info) => {
        if (err || !user) {
           return res.status(400).json({success:false, msg: info ? info.message : 'Failed to login' });
        }
        authenticate(req, res, user);
    })(req, res);
};

module.exports.logout = function(req){
    req.logout();
}