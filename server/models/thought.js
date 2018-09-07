const mongoose = require('mongoose'); 
const Artwork = require('../models/artwork');
const PersoFilePhotos = require('../models/persoFilePhotos');

// thought Schema
const ThoughtSchema = mongoose.Schema({
    name: { type:String},
    artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }],
    photos : [{type: String, ref: 'PersoFilePhotos'}]
});

module.exports = mongoose.model('Thought', ThoughtSchema);


