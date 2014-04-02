var EventEmitter = require('events').EventEmitter;
var proj4js = require('proj4');
var projections = require('../projections.js');

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

//    if (e.nodeName === 'gml:featureMember') { // WFS 1.0.0
    if (e.nodeName === 'wfs:member') { // WFS 2.0.0
     if (geometryType && coordinates.length) {
        events.emit('feature', { properties:properties, geometryType:geometryType, coordinates:coordinates });
        properties = {};
        geometryType = null;
        coordinates = [];
      }
    }

    if (parentName === 'gml:geometryMember') {
      geometryType = e.nodeName.split(':')[1];
      // TODO: for multipolygons in WFS2 init coordinates here
    }
  }.bind(this));

  xmlParser.on('tagclose', function() {
    stack.pop();
  }.bind(this));

  xmlParser.on('text', function(e) {
    if (e.nodeName === 'gml:pos') {
      var
        pair = e.nodeValue.split(' '),
        xy;
      xy = proj4js(projections[srcProj], projections[dstProj], [ parseFloat(pair[0]), parseFloat(pair[1]) ]);
      coordinates.push(xy);
    } else {
      properties[e.nodeName] = e.nodeValue;
    }
  }.bind(this));

/*** 1.0
  xmlParser.on('text', function(e) {
    if (e.nodeName === 'gml:coordinates') { // WFS 1.0.0
      var parentName = stack[stack.length-2];
      if (parentName !== 'gml:Box') { // WFS 1.0.0
        var
          coordPairs = e.nodeValue.split(' '),
          pair, xy;

        for (var i = 0; i < coordPairs.length; i++) {
          pair = coordPairs[i].split(',');
          xy = proj4js(projections[srcProj], projections[dstProj], [ parseFloat(pair[0]), parseFloat(pair[1]) ]);
          coordinates.push(xy);
        }
      } // WFS 1.0.0
    } else {
      properties[e.nodeName] = e.nodeValue;
    }
  }.bind(this));
***/

  xmlParser.on('end', function(){
    events.emit('end');
  }.bind(this));

  return events;
};

exports.converter = GmlConverter;
