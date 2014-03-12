var fs = require('fs');


var GeoJsonWriter2 = function(converter, response) {
  
  response.write('{"type":"FeatureCollection","features":[\n', 'utf8');
  
  var separator = '';
  var isFirstItem = true;

  converter.on('feature', function(feature) {
    if (isFirstItem) {
      isFirstItem = false;
    } else {
      separator = ',\n';
    }
	console.log(feature);
	response.write('HALLPO', 'utf8');
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
    console.log('ENDE');
	response.end('\n]}', 'utf8');
  });

};

exports.writer = GeoJsonWriter2;
