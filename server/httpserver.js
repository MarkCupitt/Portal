var http = require("http");
var url = require("url");


 function getUrlParams(str) {
  var data = {};
  str.substring(2).replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
    if ($1) {
      data[$1.toLowerCase()] = $2;
    }
  });
  return data;
}

var Params = [];

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  
  Params = getUrlParams(request.url);
  console.log(Params.bbox);
  
  response.end();
  
}).listen(8888);

