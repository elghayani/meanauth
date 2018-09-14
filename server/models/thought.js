const mongoose = require('mongoose'); 
const Artwork = require('../models/artwork');
const PersoFilePhotos = require('../models/persoFilePhotos');
const User = require('./user');

// thought Schema
const ThoughtSchema = mongoose.Schema({
    name: { type:String},
    images : { type : Array },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thought' }],
    parents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thought' }],
    jumps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thought' }],
    artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' }],
    photos : [{type: String, ref: 'PersoFilePhotos'}],
    idTGalaxy : {type:mongoose.Schema.Types.ObjectId, ref:'Thought'},
    useGalaxyArtworks : {type : Boolean},
    owner : {type : String, ref: 'User'}
});


module.exports = mongoose.model('Thought', ThoughtSchema);


