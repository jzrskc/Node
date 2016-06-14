var http = require('http');
var fs = require('fs');
var path = require('path');

var hostname = 'localhost';
var port = 3000;

var server = http.createServer(function(req, res){
  console.log('Request for ' + req.url + ' by method ' + req.method);
  if (req.method == 'GET') {
    var fileUrl;
        if (req.url == '/') fileUrl = '/index.html';
    else fileUrl = req.url;

//Za informacije pogledaj u Public folder
        var filePath = path.resolve('./public'+fileUrl);

//Ovdje provjeravamo extenziju file, u ovom slucaju return samo .HTML files
        var fileExt = path.extname(filePath);
        if (fileExt == '.html') {
//Provjera postojili/exists html file
       fs.exists(filePath, function(exists) {                 
           if (!exists) {
        	      res.writeHead(404, { 'Content-Type': 'text/html' });
        	      res.end('<html><body><h1>Error 404: ' + fileUrl + 
                        ' not found</h1></body></html>');
        	return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          fs.createReadStream(filePath).pipe(res);
              });
    }
//Ovo je ELSE ako nije HTML file
    else {

        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Error 404: ' + fileUrl + 
                ' not a HTML file</h1></body></html>');
    }
  }
//Ovo je ELSE ako nije GET method
  else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<html><body><h1>Error 404: ' + req.method + 
                ' not supported</h1></body></html>');
  }
})

server.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname}:${port}/`);
});
