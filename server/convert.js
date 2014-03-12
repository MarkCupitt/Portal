var HttpReader    = require('./reader/HttpReader.js').reader;
var XmlParser     = require('./parser/XmlParser.js').parser;
var GmlConverter  = require('./converter/GmlConverter.js').converter;
var GeoJsonWriter2 = require('./writer/GeoJsonWriter2.js').writer;
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

//var config = require('./config.js');

http.createServer(function(request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write("Hello World");

  var params = getUrlParams(request.url);

  if (params.bbox) {
    var
      coords = params.bbox.split(','),
      minx = parseFloat(coords[0]),
      miny = parseFloat(coords[1]),
      maxx = parseFloat(coords[2]),
      maxy = parseFloat(coords[3]);
  }

  var mainURL = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?';
  var service = '&SERVICE=WFS&VERSION=1.0.0';
  var serviceRequest = '&REQUEST=GetFeature';
  var layer = '&TYPENAME=fis:re_hausumringe';
  var srs = '&SRSNAME=EPSG:3068';

  // var minx = '372582.5329999998';
  // var miny = '5805776.33';
  // var maxx = '372963.3389999997';
  // var maxy = '5805991.101';

	/* var minx = '386436.38599999994';
	var miny = '5817479.361';
	var maxx = '386895.28199999966';
	var maxy = '5817866.671'; */

  var bbox = '&bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy;

	//var url = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:3068';

  var url = mainURL + service + serviceRequest + layer + srs + bbox;

  var file = 'data/TEST.geojson';

  var reader    = new HttpReader(url);
  var parser    = new XmlParser();
  var converter = new GmlConverter(parser, 'EPSG:25833', 'EPSG:4326');
  var writer    = new GeoJsonWriter2(converter, response);

  reader.pipe(parser);

}).listen(8888);
