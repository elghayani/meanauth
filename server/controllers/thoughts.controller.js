
const mongoose = require('mongoose');
const Thought = require('../models/thought');

module.exports.getEnv = function(req, res){
    let _id = req.query.id;
    if(_id && mongoose.Types.ObjectId.isValid(_id)){
        Thought.findById(_id, {name :1}).exec(function(err, data){
            res.json(data);
        });
    }else{
        return res.status(500).json({success : false, msg: 'url not valid'});;   
    }
}
module.exports.getImages = function(req, res){
     
    let _id = req.query.id;

    if(_id && mongoose.Types.ObjectId.isValid(_id)){
        
        let result = Thought.findById(_id,{name : 1, artworks:1, photos:1})
            .populate({ path: 'artworks', select: 'name url artistName' })
            .populate({ path: 'photos', select: 'url' });

            // name: 1, url: 1, artist: 1, artistName: 1, idTGalaxy: 1, galaxy: 1, idTArtist: 1, dz: 1, dzurl: 1
       
        
        result.exec(function(err, data){
            if(err ) {
                console.log(err.message)
                return res.status(500).json({sucess:false, msg : 'Server Error'});
            }
             if(!data) return res.status(404).json({success : false, msg: 'not found'});;   
            return res.json(data)
        })
       
    } else {
        return res.status(500).json({success : false, msg: 'url not valid'});;   
    }
}

