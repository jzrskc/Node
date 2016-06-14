var express = require('express');
var morgan = require('morgan');

var hostname = 'localhost';
var port = 3000;

var app = express();

app.use(morgan('dev'));

//moze se pristupiti svim fileovima iz foldera Public
app.use(express.static(__dirname + '/public'));

// app.listen- shortcut, ne moramo svaki put kreirati server
app.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
