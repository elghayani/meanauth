const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Users Schema

const UserSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    mobileNumber: {
        type: String,
        match: [/^[1-9][0-9]{9}$/, 'The value of path {PATH} ({VALUE}) is not a valid mobile number.']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Methods
 */
UserSchema.method({
    setPassword(password){
        let salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(password, salt);
    },
    validPassword(password, callback) {
        //return bcrypt.compareSync(password, this.password);
        bcrypt.compare(password, this.password, (err, isMatch)=>{
            if(err) throw err;
            callback(null, isMatch)
        });
    }
});

/**
 * Statics
 */
UserSchema.statics = {
    getUserById(id, callback){
        User.findById(id, callback);
    }
};

const User = module.exports = mongoose.model('User', UserSchema);





