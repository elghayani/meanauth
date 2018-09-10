
const mongoose = require('mongoose');
const Thought = require('../models/thought');

const APIError = require('../config/APIError');
const NotFoundError = new APIError('thought not Found', 404, false);
const URLError = new APIError('url not valid');
const passport   = require('passport');

const fieldsMain = {
    name : 1,
    views : 1,
    supp_infos : 1,
    children : 1,
    jumps : 1,
    parents : 1,
    images : 1,
    origin : 1,
    perm_developp: 1,
    owner : 1,
};
const fields = {
    name: 1,
    images: 1,
    origin: 1,
    isSystem: 1,
    owner: 1
}

function acessPermission(accessLevel, user, owner) {
	/*
		===> 1 Thought is public 
		===> 2  ..        friends or owner
		===> 3  ..        owner only
    */
    return (    accessLevel === '1' 
                ||  owner === user._id 
                || (accessLevel === '2' && user.friends.some( (el) => {return el.userId === owner})) 
    );
};



module.exports.getEnv = function(req, res, next){
    passport.authenticate('jwt', function(err, user) {
        if(err) return res.status(err.status).json({message :err.message});
        let _id = req.query.id;
        if(_id && mongoose.Types.ObjectId.isValid(_id)){
            Thought.findById(_id, fieldsMain)
            .exec((err, mainThought) => {
                if(err) return res.status(err.status).json({message :err.message});
                if(!mainThought) return res.status(NotFoundError.status).json({message : NotFoundError.message});
                let result  = {
                    id      : mainThought._id,
                    name    : mainThought.name,
                    owner   : false,
                    origin  : mainThought.origin && mainThought.origin.nameTableOrigin ? mainThought.origin.name : '',
                    children    : [],
                    parents     : [],
                    jumps       : [],
                    siblings    : [],
                    totalParents    : 0,
                    totalSiblings   : 0,
                    totalChildren   : 0,
                    totalJumps      : 0
                    
                };
                if( result.origin == "users" && acessPermission(mainThought.perm_developp.accesLevel, user, mainThought.owner)){
        			// if (!ifYouHavePermission) {
        			// 	capacity = capacityPrivateUser(capacity);
        			// 	mainThought.hasmosaic = false;
        			// 	mainThought.hasliveMosaic = false;				
        			// }
                }
                result.owner = Boolean(mainThought.owner == "cw49wax68qbvm5d7J") ;
                // if ( capacity.children.needs > 0 && mainThought.children && mainThought.children.length > 0) {
                //     result.totalChildren = mainThought.children.length;
                //     mainThought.children = mainThought.children.slice(capacity.children.index, capacity.children.needs);
                   
                //     let children = vendor.find({ _id: { $in: mainThought.children }, active: true }, { fields: fields }).fetch();
                //     if(capacity.cropChildren.needs > 0){
                //         for (var i = 0; i < mainThought.children.length; i++) {
                //             if(mainThought.children[i].crops){
                //                 mainThought.children[i].crops = mainThought.children[i].crops.slice(capacity.cropChildren.jumps, capacity.cropChildren.needs);
                //                 mainThought.children[i].crops = PersoFileCrop.find({ _id: { $in: mainThought.children[i].crops }}, { sort: { 'created': 1 }, fields: { name: 1, url : 1, dzurl: 1, origin: 1, created: 1, sentCrop : 1, sentTo : 1 } }).fetch();	
                //             }else{
                //                 mainThought.children[i].crops = [];
                //             }
                //         }	
                //     }
                //     if (vendor._name == thoughts._name) {
                //         for (var i = 0; i < mainThought.children.length; i++) {
                //             if (mainThought.children[i].owner == user._id) {
                //                 mainThought.children[i].owner = true;
                //             } else {
                //                 mainThought.children[i].owner = false;
                //             }
                //         }
                //     }
                // } else {
                //     mainThought.children = [];
                // }
                result.children = Thought.find({ _id: { $in: mainThought.children }, active: true }, { fields: fields }).exec();

    
                //console.log(result);
                return res.json(result);
            });
        } else{
            return res.status(URLError.status).send({message:URLError.message});
        }
    })(req, res, next);
}

module.exports.getImages = function(req, res, next){
    let _id = req.query.id;
    let result  = {
        name : '',
        artworks : [],
        photos : [],
        total : 0
    }
    if(_id && mongoose.Types.ObjectId.isValid(_id)){
                    // name: 1, url: 1, artist: 1, artistName: 1, idTGalaxy: 1, galaxy: 1, idTArtist: 1, dz: 1, dzurl: 1
        Thought.findById(_id,{ name : 1, artworks:1, photos:1, useGalaxyArtworks:1, idTGalaxy:1})
            .populate({ path: 'artworks', select: 'name url artistName' })
            .populate({ path: 'photos', select: 'url' }).exec()
            .then(function(data){
                if(!data) return Promise.reject(NotFoundError);
                else if(data && data.useGalaxyArtworks && data.idTGalaxy ){
                    result.name = data.name;
                    return Thought.findById(data.idTGalaxy,{artworks:1})
                    .populate({ path: 'artworks', select: 'name url artistName' })
                    .exec();
                }
                return Promise.resolve(data);
            })
            .then(function(data){
                if(!data) return Promise.reject(NotFoundError);
                result = {
                    name : result.name ? result.name : data.name,
                    artworks : data.artworks ? data.artworks : [],
                    photos : data.photos ? data.photos : []
                }
                result.total = result.artworks.length + result.photos.length;
                return res.json(result);
            }).catch((err) =>{
                return res.status(err.status).send({message:err.message});
            } );
    } else {
       // return next(new APIError('url not valid') );
        return res.status(URLError.status).send({message:URLError.message});
    }
}

