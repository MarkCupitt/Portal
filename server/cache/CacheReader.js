var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

var srcFile = 'cache.geojson';
var events = new EventEmitter();

// TODO: Json Stream Reader

fs.readFile(srcFile, function (err, data) {
  if (err) throw err;

  var json = JSON.parse(data);
  for (i = 0; i < json.features.length; i++){
     events.emit('feature', { properties:json.features[i].properties, geometryType:json.features[i].geometry.type, coordinates:json.features[i].geometry.coordinates });
  }
});



//exports.reader = CacheReader;