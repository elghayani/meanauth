const mongoose = require('mongoose');
const mongoosastic=require("mongoosastic");
const elasticsearch = require('../config/elastic-search');

   
// template Schema
const TemplateSchema = mongoose.Schema({
    name: { type:String, es_indexed: true,   "analyzer" : "lowercase_analyzer"},
    active : {type : Boolean, es_indexed:true},
    owner : {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
        type : String, 
        es_indexed:true
    },
    
    perm_developp : {
        accesLevel :{type : String, es_indexed: true}
    }
});

TemplateSchema.plugin(mongoosastic,{  esClient: elasticsearch.getElasticInstance()}); 
const Template = module.exports = mongoose.model('Template', TemplateSchema);

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
