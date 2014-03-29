var CacheReader   = require('CacheReader.js').reader;
var CacheWriter   = require('CacheWriter.js').writer;


var srcFile = 'cache.geojson';
var dstFile = 'TESTcache.geojson';

var reader    = new CacheReader(srcFile);
var writer    = new CacheWriter(reader, dstFile);

//reader.pipe(parser);
