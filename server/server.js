const mongoose = require('mongoose');
const config = require('./config/config');
const app = require('./config/express');

// connect to mongo db
const mongoUri = config.MONGO_HOST+config.Mongo_DB;
mongoose.connect(mongoUri);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

mongoose.connection.on('connected', ()=>{
    console.log(`connected to database :  ${mongoUri}`);
});

  // listen on port config.port
  app.listen(config.SERVER_PORT, () => {
    console.info(`server started on port ${config.SERVER_PORT} (${config.SERVER_ENV})`); // eslint-disable-line no-console
  });

module.exports = app;
