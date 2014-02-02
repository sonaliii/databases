var path = require('path');
var fs = require('fs');

exports.paths = paths = {
  'client' : path.join(__dirname, '../client')
};

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(response, asset) {
  var encoding = {encoding: 'utf8'};
  fs.readFile( paths.client + asset, encoding, function(err, data) {
    if(err) {
      send404(response);
    } else {
      sendResponse(response, data);
    }
  });
};

// As you progress, keep thinking about what helper functions you can put here!

exports.sendResponse = sendResponse = function(response, asset, status){
  status = status || 200;
  response.writeHead(status, headers);
  response.end(asset);
};

exports.sendRedirect = sendRedirect = function(response, url, status){
  status = status || 302;
  headers.location = url;
  response.writeHead(status, headers);
  response.end();
};

exports.send404 = send404 = function(response) {
  exports.sendResponse(response, '404: Page not found', 404);
};

exports.collectData = function(request, callback){
  var data = "";
  request.on("data", function(chunk){
    data += chunk;
  });
  request.on("end", function(){
    callback(data);
  });
};