var EventEmitter = require('events').EventEmitter;
var proj4js = require('proj4');
var projections = require('../projections.js');

var KmlConverter = function(xmlParser, srcProj, dstProj) {
  this.readable = true;

  var events = new EventEmitter();

  function parseCoordinates(str) {
    var
      coords = str.replace(/[\r\n]+/, '\n').split('\n'), c,
      res = [];

    for (var i = 0, il = coords.length; i < il; i++) {
      c = coords[i].split(',');
      res[i] = [parseFloat(c[0]), parseFloat(c[1]), parseFloat(c[2])];
    }

    return res;
  }

  var
    properties = {},
    geometryType = null,
    coordinates = [];

  var stack = [];

  xmlParser.on('tagopen', function(e) {
    stack.push(e.nodeName);
    switch (e.nodeName) {
      case 'Point':
      case 'LineString':
      case 'Polygon':
        if (geometryType) {
          events.emit('feature', { properties:properties, geometryType:geometryType, coordinates:coordinates });
        }
        geometryType = e.nodeName;
      break;
    }
  }.bind(this));

  xmlParser.on('tagclose', function() {
    stack.pop();
  }.bind(this));

  xmlParser.on('text', function(e) {
    if (stack[stack.length-2] === 'Placemark' && e.nodeName === 'name') {
      properties.name = e.nodeValue;
    }

    if (e.nodeName === 'coordinates' && e.nodeValue) {
      coordinates = parseCoordinates(e.nodeValue);
    }
  }.bind(this));

  xmlParser.on('end', function(){
    events.emit('end');
  }.bind(this));

  return events;
};

exports.converter = KmlConverter;
