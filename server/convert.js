var HttpReader    = require('./reader/HttpReader.js').reader;
var XmlParser     = require('./parser/XmlParser.js').parser;
var GmlConverter  = require('./converter/GmlConverter.js').converter;
var GeoJsonWriter2 = require('./writer/GeoJsonWriter2.js').writer;
var http = require("http");
var url = require("url");
var proj4js = require('proj4');
var projections = require('./converter/projections.js');

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
  response.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin":"*"});

  var Params = getUrlParams(request.url);
  if (Params.bbox === undefined){
	response.end();
	return;
	}

	var coords = [];
    coords = Params.bbox.split(',');

  southwest =  proj4js(projections['EPSG:4326'], projections['EPSG:25833'], [ parseFloat(coords[0]), parseFloat(coords[1]) ]);
	northeast =  proj4js(projections['EPSG:4326'], projections['EPSG:25833'], [ parseFloat(coords[2]), parseFloat(coords[3]) ]);

	var minx = southwest[0];
	var miny = southwest[1];
	var maxx = northeast[0];
	var maxy = northeast[1];

  var mainURL = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?';
  var service = '&SERVICE=WFS&VERSION=2.0.0';
  var serviceRequest = '&REQUEST=GetFeature';
  var layer = '&TYPENAMES=' + encodeURIComponent('fis:re_hausumringe');
  var srs = '&SRSNAME=' + encodeURIComponent('EPSG:25833');

  var bbox = '&bbox=' + minx + ',' + miny + ',' + maxx + ',' + maxy;


	//var url = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:25833';

	// VERSION 2.0.0
	// var url = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=fis:re_hausumringe&srsName=EPSG:25833';
	// EPSG 4258 BBOX
	// 13.127603028677113,52.38748335621991,13.133269549188546,52.389348978536006
	// EPSG 25833 BBOX
	// 372582.5329999998,5805776.33,372963.3389999997,5805991.101

  var url = mainURL + service + serviceRequest + layer + srs + bbox;

  var file = 'data/TEST.geojson';

  var reader    = new HttpReader(url);
  var parser    = new XmlParser();
  var converter = new GmlConverter(parser, 'EPSG:25833', 'EPSG:4326');
  var writer    = new GeoJsonWriter2(converter, response);

  reader.pipe(parser);

}).listen(8888);
