var fs = require('fs');
var path = require("path");
var util   = require('util');
var EventEmitter = require('events').EventEmitter;
var crypto = require('crypto');
var GeoJsonWriter = require('../writer/GeoJsonWriter.js').writer;

var Cache = {};

Cache.createFileName = function(key) {
  var src = crypto.createHash('md5').update(key).digest('hex');
  return './cache/data/' + src + '.geojson';
};

Cache.exists = function(key) {
  return fs.existsSync(Cache.createFileName(key));
};

Cache.read = function(key) {
  var events = new EventEmitter();
  fs.readFile(Cache.createFileName(key), function (err, data) {
    if (err) throw err;
    var
      json = JSON.parse(data.toString()),
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

Cache.write = function(converter, key) {
  new GeoJsonWriter(converter, Cache.createFileName(key));
};

//Cache.purge = function(){
  var p = './cache/data';

  fs.readdir(p, function (err, files) {
    var totalSize = 0,
        sizeLimit = 1024 * 1024;
    var fileList = [];
    if (err) {
        throw err;
    };

    files.forEach(function (file) {
      var stats = fs.statSync(p + '/' + file);
      totalSize += stats.size;
      fileList.push({
        name: file.toString(),
        size: stats.size,
        mtime: stats.mtime.getTime()
      });
    });

    fileList.sort(function(a,b){
      return a.mtime - b.mtime;
    });

    while (totalSize > sizeLimit){
      totalSize -= fileList[0].size;

      fs.unlink('./cache/data/' + fileList[0].name, function (err) {
        console.log('successfully deleted: ' + fileList[0].name);
        fileList.shift();
      });
     }
    });

//};
exports.Cache = Cache;
