const mongoose = require('mongoose');
const Template = require('../models/template');


module.exports.searchTemplate = function(req, res){
    Template.search({        
        "query": {
            "bool": {
              "must": [
                { "query_string": { "name" : {"query": "*"+req.query.name+"*", "default_operator":"and" , "analyze_wildcard": true}}},
                { "match": { "active": true } },
                {   "term": { 'perm_developp.accesLevel': "1" } }
              ]
            }
        }
    },{
        from: 0,
        size: 30,
        sort: {
            "_score": "desc"
          },
        hydrate:true, 
        hydrateOptions: {select: 'name images origin.nameTableOrigin' }  
    },function(err, templates){
        if(err ) throw err;
        else if(!templates) return res.json([]);  
        return res.json( templates.hits.hits);
    });

}

module.exports.searchPrivateTemplate = function(req, res){
    let friends = [''];
    let userId = req.user ? req.user._id : '';//cw49wax68qbvm5d7J
    if (req.user && req.user.friends) {
        friends = [];//req.user.friends;
    }
    Template.search({        
        "query": {
            "bool": {
                 "must": [
                    { "query_string": { "name" : {"query": "*"+req.query.name+"*", "default_operator":"and" , "analyze_wildcard": true}}},
                    {  "match": { "active": true } },
                 ],
                "filter": {
                     "bool": {
                         "should": [
                             { "match": { "owner": userId }  },
                             { "term": { 'perm_developp.accesLevel': "1" } },
                             { "bool": {
                                 "must": [
                                     { "match": { "owner": {"query" :friends } }  },
                                     { "term": { 'perm_developp.accesLevel': "2" } },
                                 ]}
                             }
                         ]
                     }
                 },
                
            }
        }
    },{
        from: 0,
        size: 30,
        sort: {
            "_score": "desc"
          },
        hydrate:true, 
        hydrateOptions: {select: 'name images origin.nameTableOrigin' }  
    },function(err, templates){
        if(err ) throw err;
        else if(!templates) return res.json([]);  
        return res.json( templates.hits.hits);
    });
}


