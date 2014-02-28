var fs = require('fs');

var GeoJsonWriter = function(converter, file) {
  var stream = fs.createWriteStream(file);
  stream.write('{"type":"FeatureCollection","features":[\n', 'utf8');
  
  var separator = '';
  var isFirstItem = true;

  converter.on('feature', function(feature) {
    if (isFirstItem) {
      isFirstItem = false;
    } else {
      separator = ',\n';
    }
    stream.write(separator + JSON.stringify({
      type: 'Feature',
      properties: feature.properties,
      geometry: {
        type: feature.geometryType,
        coordinates: [feature.coordinates]
      }
    }), 'utf8');
  }.bind(this));
  
  converter.on('end', function() {
    stream.write('\n]}', 'utf8');
    stream.end();
  });
  
  return stream;
};

exports.writer = GeoJsonWriter;
