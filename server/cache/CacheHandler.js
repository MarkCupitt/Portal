var fs = require('fs');
var util   = require('util');
var events = require('events');

var ChacheHandler = function(){
  events.EventEmitter.call(this);
  this.readable = true;
};

util.inherits(reader, events.EventEmitter);
var proto = CacheHandler.prototype;

proto.check = function(key) {

  // TODO: key -> srcFile
  var srcFile = 'cache.geojson';

  fs.exists(srcFile, function(exists) {
    if (exists) {
     fs.readFile(srcFile, function (err, data) {
        if (err) throw err;

        var
          json = JSON.parse(data),
          feature;
        for (var i = 0, il = json.features.length; i < il; i++) {
          feature = json.features[i];
          this.emit('feature', {
            properties:feature.properties,
            geometryType:feature.geometry.type,
            coordinates:feature.geometry.coordinates
          });
        }
        this.emit('end');
      }.bind(this));
     }
  }.bind(this));
};

exports.cache = CacheHandler;
