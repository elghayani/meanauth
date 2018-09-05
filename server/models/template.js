const mongoose = require('mongoose');
//const mongoosastic=require("mongoosastic");
//const elasticsearch = require('../config/elastic-search');

   
// template Schema
const TemplateSchema = mongoose.Schema({
    // name: { type:String, es_indexed: true,  /* "analyzer" : "lowercase_analyzer"*/},
    // active : {type : Boolean, es_indexed:true},
    // owner : {type : String, es_indexed:true},
    // perm_developp : {
    //     accesLevel :{type : String, es_indexed: true}
    // }
});

//TemplateSchema.plugin(mongoosastic,{  esClient: elasticsearch.getElasticInstance()}); 
const Template = module.exports = mongoose.model('Template', TemplateSchema);

 module.exports.searchTemplate = function(name, user, callback){
    //console.log(user)
    let friends = ['S525rytAcbJWx8nDx'];
    let userId = user ? user._id : 'cw49wax68qbvm5d7J';//"cw49wax68qbvm5d7J"
    if (user && user.friends) {
        friends = user.friends;
    }
       
    // Template.search({        
    //     "query": {
    //         "bool": {
    //             "must": [
    //                 {   "wildcard": {"name" : "*"+name+"*" } },//check space
    //                 {   "match": { "active": true } },
    //             ],
    //             "filter": {
    //                 "bool": {
    //                     "should": [
    //                         { "term": { "owner": userId }  },
    //                         { "term": { 'perm_developp.accesLevel': "1" } },
    //                         { "bool": {
    //                             "must": [
    //                                 { "match": { "owner": {"query" :friends } }  },
    //                                 { "term": { 'perm_developp.accesLevel': "2" } },
    //                             ]}
    //                         }
    //                     ]
    //                 }
    //             },
               
    //         }
    //       }
    //     // filtered: {
    //     //     filter: {
    //     //         bool: {
    //     //             must: [
    //     //                 {  wildcard: {"name" : "*"+name.toLowerCase()+"*" } },//check space
    //     //                 { term: { "active": true}},
    //     //             ],
    //     //             should: [
    //     //                 { term: { "owner": "cw49wax68qbvm5d7J" }  },
    //     //                 { term: { 'perm_developp.accesLevel': "1" } },
    //     //             ]
    //     //         }
    //     //     }
    //     // }
    // },{
    //     from: 0,
    //     size: 30,
    //     sort: {
    //         "_score": "desc"
    //       },
    //     hydrate:true, 
    //     hydrateOptions: {select: 'name images origin.nameTableOrigin' }  
    // },callback);
   Template.find({name : name},callback);

 }

// Template.createMapping(function(err, mapping){  
//     if(err){
//       console.log('error creating mapping (you can safely ignore this)');
//       console.log(err);
//     }else{
//       console.log('mapping created!');
//       console.log(mapping);
//     }
// });


// var stream = Template.synchronize();
// var count = 0;
// stream.on('data', function(err, doc){
//     count++;
// });
// stream.on('close', function(){
//     console.log('indexed ' + count + ' documents!');
// });
// stream.on('error', function(err){
//     console.log(err);
// });



