var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

var CacheHandler = function(key) {
  this.readable = true;

  var srcFile = 'cache.geojson';

  var events = new EventEmitter();

  fs.readFile(srcFile, function (err, data) {
    if (err) throw err;

    var
      json = JSON.parse(data),
      feature;
    for (var i = 0, il = json.features.length; i < il; i++) {
      feature = json.features[i];
      events.emit('feature', {
        properties:feature.properties,
        geometryType:feature.geometry.type,
        coordinates:feature.geometry.coordinates
      });
    }
    events.emit('end');
  });

  return events;
};

exports.cache = CacheHandler;
