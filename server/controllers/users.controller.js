
const User = require('../models/user');

module.exports.profileRead = function(req, res) {
    if (!req.user._id) {
        res.status(401).json({
          "message" : "UnauthorizedError: private profile"
        });
    } else {
        res.status(200).json({user :req.user});
    }
};
