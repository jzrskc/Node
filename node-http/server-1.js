var http = require('http');

var hostname = 'localhost';
var port = 3000;

//pravimo Server; (zahtjev, odgovor)
var server = http.createServer(function(req, res){
  console.log(req.headers);
    res.writeHead(200, { 'Content-Type': 'text/html' }); //200 == OK
  res.end('<html><body><h1>Hello World</h1></body></html>'); //res.end = SendBack
  })
//Startamo server tako sto ga pozivamo
server.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
