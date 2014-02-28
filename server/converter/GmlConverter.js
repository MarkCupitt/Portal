var EventEmitter = require('events').EventEmitter;
var proj4js = require('proj4');
var projections = require('./projections.js');

var GmlConverter = function(xmlParser, srcProj, dstProj) {
  this.readable = true;

  var events = new EventEmitter();

  var
    properties = {},
    geometryType = null,
    coordinates = [];

  var stack = [];

  xmlParser.on('tagopen', function(e) {
    stack.push(e.nodeName);

    var parentName = stack[stack.length-2];

    if (e.nodeName === 'gml:featureMember') {
     if (geometryType && coordinates.length) {
        events.emit('feature', { properties:properties, geometryType:geometryType, coordinates:coordinates });
        properties = {};
        geometryType = null;
        coordinates = [];
      }
    }

    if (parentName === 'gml:geometryMember') {
      geometryType = e.nodeName.split(':')[1];
    }
  }.bind(this));

  xmlParser.on('tagclose', function() {
    stack.pop();
  }.bind(this));

  xmlParser.on('text', function(e) {
    if (e.nodeName === 'gml:coordinates') {
      var parentName = stack[stack.length-2];

      if (parentName !== 'gml:Box') {
        var
          coordPairs = e.nodeValue.split(' '),
          pair, xy;

        for (var i = 0; i < coordPairs.length; i++) {
          pair = coordPairs[i].split(',');
          xy = proj4js(projections[srcProj], projections[dstProj], [ parseFloat(pair[0]), parseFloat(pair[1]) ]);
          coordinates.push(xy);
        }
      }
    } else {
      properties[e.nodeName] = e.nodeValue;
    }
  }.bind(this));

  xmlParser.on('end', function(){
    events.emit('end');
  }.bind(this));
  
  return events;
};

exports.converter = GmlConverter;
