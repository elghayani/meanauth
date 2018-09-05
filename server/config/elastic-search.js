const elasticsearch = require("elasticsearch");
let elasticClient;


module.exports.getElasticInstance = () => {
    if (elasticClient)
        return elasticClient;
    elasticClient = new elasticsearch.Client({
        host: 'localhost:9200'
    });
    return elasticClient;
};