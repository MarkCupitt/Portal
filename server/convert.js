var HttpReader    = require('./reader/HttpReader.js').reader;
var XmlParser     = require('./parser/XmlParser.js').parser;
var GmlConverter  = require('./converter/GmlConverter.js').converter;
var GeoJsonWriter = require('./writer/GeoJsonWriter.js').writer;

//var config = require('./config.js');

var url = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:3068';
var file = 'data/TEST.geojson';

var reader    = new HttpReader(url);
var parser    = new XmlParser();
var converter = new GmlConverter(parser, 'EPSG:25833', 'EPSG:4326');
var writer    = new GeoJsonWriter(converter, file);

reader.pipe(parser);
