var HttpReader   = require('./reader/HttpReader.js').reader;
var XmlParser    = require('./parser/XmlParser.js').parser;
var GmlConverter = require('./converter/GmlConverter.js').converter;
var HttpWriter   = require('./writer/HttpWriter.js').writer;

var http = require('http');
var url  = require('url');
var BBox = require('./BBox.js').BBox;

http.createServer(function(request, response) {
  var bbox = BBox(url.parse(request.url, true).query);

  if (!bbox) {
    response.writeHead(404);
    response.end();
    return;
	}

  var u = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?'+
    'SERVICE=WFS&'+
    'VERSION=2.0.0&'+
    'REQUEST=GetFeature&'+
    'TYPENAMES='+ encodeURIComponent('fis:re_hausumringe') +'&'+
    'SRSNAME='+ encodeURIComponent('EPSG:25833') +'&'+
    'BBOX='+ bbox.project('EPSG:25833').toString('w,s,e,n');

//response.writeHead(200);
//response.end(u);
//return;

  // http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:25833
  // EPSG 4258 BBOX: 13.127603028677113,52.38748335621991,13.133269549188546,52.389348978536006
  // EPSG 25833 BBOX: 372582.5329999998,5805776.33,372963.3389999997,5805991.101

  var reader    = new HttpReader(u);
  var parser    = new XmlParser();
  var converter = new GmlConverter(parser, 'EPSG:25833', 'EPSG:4326');
  var writer    = new HttpWriter(converter, response);

  reader.pipe(parser);

}).listen(8888);
