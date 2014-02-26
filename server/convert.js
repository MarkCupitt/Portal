var XmlHttpStream = require('./XmlHttpStream.js');
var fs     = require('fs');
var proj   = require('proj4');
var config = require('./config.js');

var url = 'http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:3068';
var fileName = './TESTgeojson.xml';

var feature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: null,
    coordinates: [
      []
    ]
  }
};

var stack = [];
var isFirstItem = true;
var separator = '';

fs.writeFileSync(fileName, '{"type":"FeatureCollection","features":[\n');

var xml = XmlHttpStream.get(url)
  .on('tag-open', function(e) {
    stack.push(e.nodeName);

    var parentName = stack[stack.length-2];

    if (e.nodeName === 'gml:featureMember') {
     if (feature.geometry.type && feature.geometry.coordinates[0].length) {
        if (isFirstItem) {
           isFirstItem = false;
        } else {
          separator = ',\n';
        }

        fs.appendFileSync(fileName, separator + JSON.stringify(feature));

        feature = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: null,
            coordinates: [
              []
            ]
          }
        };
      }
    }

    if (parentName === 'gml:geometryMember') {
      feature.geometry.type = e.nodeName.split(':')[1];
    }
  })

  .on('tag-close', function() {
    stack.pop();
  })

  .on('text', function(e) {
    if (e.nodeName === 'gml:coordinates') {
      var parentName = stack[stack.length-2];

      if (parentName !== 'gml:Box') {
        var
          coordPairs = e.nodeValue.split(' '),
          pair, xy;

        for (var i = 0; i < coordPairs.length; i++) {
          pair = coordPairs[i].split(',');
          xy = proj(config.proj['EPSG:25833'], config.proj['EPSG:4326'], [ parseFloat(pair[0]), parseFloat(pair[1]) ]);
          feature.geometry.coordinates[0].push(xy);
        }
      }
    } else {
      feature.properties[e.nodeName] = e.nodeValue;
    }
  })
  .on('end', function(){
    fs.appendFileSync(fileName, '\n]}');
  });
