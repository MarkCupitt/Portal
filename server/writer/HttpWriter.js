var fs = require('fs');

var HttpWriter = function(converter, response) {
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*'
  });

  response.write('{"type":"FeatureCollection","features":[\n', 'utf8');

  var separator = '';
  var isFirstItem = true;

  converter.on('feature', function(feature) {
    if (isFirstItem) {
      isFirstItem = false;
    } else {
      separator = ',\n';
    }

    // TODO: also write to cache
    response.write(separator + JSON.stringify({
     type: 'Feature',
       properties: feature.properties,
       geometry: {
         type: feature.geometryType,
         coordinates: [feature.coordinates]
       }
    }), 'utf8');
  }.bind(this));

  converter.on('end', function() {
    response.end('\n]}', 'utf8');
  });
};

exports.writer = HttpWriter;
