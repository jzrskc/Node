var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var hostname = 'localhost';
var port = 3000;

var dishRouter = require('./dishRouter');
var leaderRouter = require('./leaderRouter');
var promoRouter = require('./promoRouter');

var app = express();
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.json());

//mounting routes
app.use('/dishes', dishRouter);
app.use('/leadership', leaderRouter);
app.use('/promotions', promoRouter);

//handle requests that are not supported / found in the server
app.use(function(req, res, next) {
  res.status = 404;
  res.end("Error: Cannot " + req.method + " " + req.url + " it's not implemented ");
});


app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function(){
  console.log('Server running at http://'+hostname+':'+port);
});