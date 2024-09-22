const restify = require('restify'); // import restify
// const dotenv = require('dotenv'); // import dotenv
const multer = require('multer'); // Use multer
const path = require('path'); // Import the path module
const functions = require('../Gapblue_Sports_Project/src/Services/functions');
// dotenv.config(); // to configure env variables
const corsMiddleware=require('restify-cors-middleware');
const teamRoutes = require('./src/routes/teamRoutes')



const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser())

const cors = corsMiddleware({

  origins: ['http://localhost:4200'], 

  allowHeaders: ['Authorization'],

  exposeHeaders: ['Authorization'],

});



server.pre(cors.preflight);

server.use(cors.actual);



teamRoutes(server);



// assigning a port for the server to listen, along with a callback function to verify that the server is up and listening
server.listen(process.env.PORT||8004, () => {
  console.log(`Server is running on port ${process.env.PORT || 8004}`);
});
