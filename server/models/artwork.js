const mongoose = require('mongoose');   
// artwork Schema
const ArtworkSchema = mongoose.Schema({
    name: { type:String},
});

module.exports = mongoose.model('Artwork', ArtworkSchema);
