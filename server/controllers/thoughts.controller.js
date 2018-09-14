
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
        let _id = req.body._id;
        let capacity = req.body.capacity;
        //console.log(req.body)
        if(_id && mongoose.Types.ObjectId.isValid(_id)){
            Thought.findById(_id, fieldsMain)
            .populate({ 
                path: 'children', 
                match: {active:true},
                select: 'name images' 
            })
            .populate({ 
                path: 'jumps', 
                match: {active:true},
                select: 'name images' 
            })
            .populate({ 
                path: 'parents', 
                match: {active:true}, 
                select: 'name images children',
                populate : { 
                    path : 'children', 
                    match: {active:true}, 
                    // options: { 
                    //     skip  :  capacity.siblings.index,
                    //     limit : capacity.siblings.limitTo 
                    // }, 
                    select :'name images'
                } 
            })
            // .slice('children', capacity.children.index, capacity.children.limitTo)
            // .slice('jumps',    capacity.jumps.index, capacity.jumps.limitTo)
            // .slice('parents',  capacity.parents.index, capacity.parents.limitTo)
            .exec((err, mainThought) => {
                if(err) return res.status(err.status).json({message :err.message});
                if(!mainThought) return res.status(NotFoundError.status).json({message : NotFoundError.message});
                //console.log(mainThought)
                let result  = {
                    main : {
                        id      : mainThought._id,
                        name    : mainThought.name,
                        icon    : mainThought.images.length>0 ? mainThought.images[0] : '', 
                        owner   : false,
                        origin  : mainThought.origin && mainThought.origin.nameTableOrigin ? mainThought.origin.name : '',
                    
                    },

                    children    : capacity.children.active ? mainThought.children.slice(capacity.children.index, capacity.children.limitTo) : [],
                    parents     : capacity.parents.active ? mainThought.parents.slice(capacity.parents.index, capacity.parents.limitTo) :[],
                    siblings    : [],
                    jumps       : capacity.jumps.active ? mainThought.jumps.slice(capacity.jumps.index, capacity.jumps.limitTo) : [],
                    
                    totalChildren   :  mainThought.children.length,
                    totalParents    :  mainThought.parents.length,
                    totalSiblings   :  0,
                    totalJumps      :  mainThought.jumps.length,
                    
                };
                if( result.main.origin == "users" && acessPermission(mainThought.perm_developp.accesLevel, user, mainThought.owner)){
        			// if (!ifYouHavePermission) {
        			// 	capacity = capacityPrivateUser(capacity);
        			// 	mainThought.hasmosaic = false;
        			// 	mainThought.hasliveMosaic = false;				
        			// }
                }
                result.main.owner = Boolean(mainThought.owner == "cw49wax68qbvm5d7J") ;
                if(capacity.siblings.active){
                    let nbrSibligns = 0;
                    mainThought.parents.map((parent)=>{
                        let child = parent.children.splice(capacity.siblings.index, capacity.siblings.limitTo-nbrSibligns);  
                        // child.forEach(e => {
                        //     e.idParent = parent._id;
                        //     console.log(e)
                        // });
                        //console.log(child)

                        result.siblings.push({_idT : parent._id , total : parent.children.length, children : child});
                        //result.siblings = result.siblings.concat(child);
                        nbrSibligns+=parent.children.length;
                        // parent.children = parent.children.slice(capacity.siblings.index, capacity.siblings.limitTo-nbrSibligns);    
                        parent.children = undefined;
                    });
                    result.totalSiblings = nbrSibligns;
                }
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

