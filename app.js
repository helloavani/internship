const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



const app = express();

app.use(bodyParser.json());
app.use(function(req, res, next){
res.header("Access-control-Allow-Origin","*");
res.header('Access-control-Allow-Methods','DELETE, PUT, GET, POST');
res.header("Access-control-Allow-Headers","Origin, X-requested-With, Content-type, Accept,Authorization,token");
next();
});




app.use(bodyParser.urlencoded({
   extended:true
}));

mongoose.connect('mongodb://localhost:27017/userDb',{
   useNewUrlParser:true,
   useUnifiedTopology:true
});

mongoose.Promise = global.Promise;

mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
  });


  app.get('/', (req, res) => res.send('Hello World with Express'));

  const api = require('./APIroutes');
  let port = process.env.PORT || 3000;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use('/api/v1',api); 

  app.listen(port, function () {
    console.log("Running server on port " + port);
});

module.exports = app;

