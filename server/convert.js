var HttpReader    = require('./reader/HttpReader.js').reader;
var XmlParser     = require('./parser/XmlParser.js').parser;
var KmlConverter  = require('./converter/KmlConverter.js').converter;
var GeoJsonWriter = require('./writer/GeoJsonWriter.js').writer;

var url = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:3068';
var file = 'data/Barcelona.geojson';

var fs = require('fs');
var reader    = fs.createReadStream('./data/Barcelona.kml');
//var reader  = new HttpReader(url);
var parser    = new XmlParser();
var converter = new KmlConverter(parser, 'EPSG:25833', 'EPSG:4326');
var writer    = new GeoJsonWriter(converter, file);

reader.pipe(parser);
