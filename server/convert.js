var HttpReader    = require('./reader/HttpReader.js').reader;
var XmlParser     = require('./parser/XmlParser.js').parser;
var KmlConverter  = require('./converter/KmlConverter.js').converter;
var GeoJsonWriter = require('./writer/GeoJsonWriter.js').writer;
var Cache         = require('./cache/Cache.js').Cache;

//var src = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:3068';
var src = './data/Barcelona.kml';
var dst = 'data/Barcelona.geojson';

if (Cache.exists(src)) {
  new GeoJsonWriter(Cache.read(src), dst);
} else {
  var fs = require('fs');
  var reader    = fs.createReadStream(src);
  //var reader  = new HttpReader(src);
  var parser    = new XmlParser();
  var converter = new KmlConverter(parser, 'EPSG:25833', 'EPSG:4326');
  Cache.write(converter, src);
  new GeoJsonWriter(converter, dst);

  reader.pipe(parser);
}
