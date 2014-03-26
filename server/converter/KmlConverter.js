var EventEmitter = require('events').EventEmitter;
var proj4js = require('proj4');
var projections = require('../projections.js');


function numarray(x) {
    for (var j = 0, o = []; j < x.length; j++) o[j] = parseFloat(x[j]);
    return o;
}

var KmlConverter = function(xmlParser, srcProj, dstProj) {
  this.readable = true;

  var events = new EventEmitter();

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
            events.emit('feature', {
                type: 'Feature',
                geometry: {
                   type: geometryType,
                   coordinates: coordinates
                },
                properties: properties
            });
console.log(e.nodeName);
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
    if (e.nodeName === 'coordinates') {
console.log(e.nodeValue);
//        coordinates = numarray(e.nodeValue.split(','));
        coordinates = e.nodeValue;
    }
  }.bind(this));

  xmlParser.on('end', function(){
    events.emit('end');
  }.bind(this));

  return events;
};

exports.converter = KmlConverter;
