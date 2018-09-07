const mongoose = require('mongoose');   
// PersoFilePhotos Schema
const PersoFilePhotosSchema = mongoose.Schema({
    _id : { type : String },
    name: { type : String },
});

module.exports = mongoose.model('PersoFilePhotos',PersoFilePhotosSchema);
