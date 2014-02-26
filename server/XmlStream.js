var util   = require('util');
var events = require('events');
var http = require('http');
var fs = require('fs');
var proj = require("proj4");
var config = require('./config.js');

function write(str, file) {
	fs.writeFileSync(file, str, 'utf8');
}

//var templateGeoJson = '{"type":"FeatureCollection",' +
//  '"features":[{"type":"Feature",' +
//  '"properties":{},' +
//  '"geometry":{"type":"{geometryType}",' +
//  '"coordinates":[]' +
//  '}}]}\n';

fs.writeFile('./TESTgeojson.xml', '{"type":"FeatureCollection","features":[\n');

var url = "http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:3068";

var XmlStream = exports.XmlStream = function(url) {
  events.EventEmitter.call(this);

  var str = '';
  http.get(url, function(res) {

    res.on('data', function(buffer) {
      str += buffer.toString();

      var m;
      while (m = str.match(/(.*?)<(\/)?([a-z_:-]+)([^>]*)(\/)?>/i)) {
//      while (m = str.match(/(.*?)<(\/)?([a-z_:-]+)([^>]*)(\/)?>/i)) {
        if (m[1] !== '') {
          this.emit('text', { text: m[1] });
        }
        if (m[2]) {
          this.emit('tag-close', { name: m[3] });
        } else if (m[5]) {
          this.emit('tag-open', { name: m[3], attributes: m[4] });
          this.emit('tag-close', { name: m[3] });
        } else {
          this.emit('tag-open', { name: m[3], attributes: m[4] });
        }
        str = str.substring(m[0].length);
      }
    }.bind(this))
    .on('end', function () {
      this.emit('end');
    }.bind(this))
  }.bind(this));
};

util.inherits(XmlStream, events.EventEmitter);
var proto = XmlStream.prototype;

var stack = [];
var feature = {};
var json_str = '';
var geoJson_str = '';
var geojson = {type:'Feature', properties:{}, geometry:{coordinates:[[]]}};
var coord_x = [],coord_y = [];
var flag = false;

var xml = new XmlStream(url)
  .on('tag-open', function(args) {
    stack.push(args.name);

    if (args.name === 'gml:featureMember'){
     if (geojson.geometry.type !== undefined && geojson.geometry.coordinates[0].length){
        fs.appendFile('./TESTgeojson.xml', JSON.stringify(geojson) + ',\n');
        geojson = {type:'Feature', properties:{}, geometry:{coordinates:[[]]}};
      }
    }
    if (stack[stack.length-2] === 'gml:geometryMember'){
      geojson.geometry.type = args.name.split(':')[1];
    }
  })
  .on('tag-close', function(args) {
//    console.log(args);
   if (args.name === 'wfs:FeatureCollection'){
     console.log('HALLO');
     fs.appendFile('./TESTgeojson.xml', 'ENDE');
   }
   stack.pop();
  })
  .on('text', function(args) {
    if (stack[stack.length-1] === 'gml:coordinates'){
      if (stack[stack.length-2] !== 'gml:Box'){
        var coord_split = args.text.split(' ');

        for (var i=0; i<coord_split.length; i++){
          coords = coord_split[i].split(',');
//          coord_x = parseFloat(coords[0]);
//          coord_y = parseFloat(coords[1]);

          coord_x = proj(config.proj['EPSG:25833'], config.proj['EPSG:4326'], [parseFloat(coords[0]),parseFloat(coords[1])])[0];
          coord_y = proj(config.proj['EPSG:25833'], config.proj['EPSG:4326'], [parseFloat(coords[0]),parseFloat(coords[1])])[1];

          geojson.geometry.coordinates[0].push([coord_x, coord_y]);
        }
      }
    } else {
      geojson.properties[stack[stack.length-1]] = args.text;
    }
  })
  .on('end', function(){
    fs.appendFile('./TESTgeojson.xml', ']}');
  });
