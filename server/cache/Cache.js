var fs = require('fs');
var util   = require('util');
var EventEmitter = require('events').EventEmitter;
var crypto = require('crypto');
var GeoJsonWriter = require('../writer/GeoJsonWriter.js').writer;

var Cache = {};

Cache.createFileName = function(key) {
  var src = crypto.createHash('md5').update(key).digest('hex');
  return './cache/' + src + '.geojson';
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

/*
  public function purge() {
		$sum = 0;
    $cache = array();
		$fp = opendir($this->path);
		if ($fp) {
			while ($item = readdir($fp)) {
        $fileName = $this->path."/$item";
				if (!is_file($fileName)) {
					continue;
				}
				$fileSize = filesize($fileName);
				$sum += $fileSize;
				$cache[ filemtime($fileName) ] = array("name"=>$fileName, "size"=>$fileSize);
			}
			closedir($fp);
		}

    ksort($cache);
    while($sum > $this->size) {
      $file = array_shift($cache);
      $sum -= $file["size"];
      unlink($file["name"]);
    }
  }
*/

exports.Cache = Cache;
