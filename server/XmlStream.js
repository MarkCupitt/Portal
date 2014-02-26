var util   = require('util');
var events = require('events');
var http = require('http');
var fs = require('fs');

function write(str, file) {
	fs.writeFileSync(file, str, 'utf8');
}

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
    .on('close', function () {
      this.emit('end');
    }.bind(this))
  }.bind(this));
};

util.inherits(XmlStream, events.EventEmitter);
var proto = XmlStream.prototype;

var stack = [];
var feature = {};
var json_str = '';

var xml = new XmlStream(url)
  .on('tag-open', function(args) {
//    console.log(args);
    stack.push(args.name);

    if (args.name === 'gml:featureMember'){

//      console.log(feature);
      feature = {};
    }
    if (stack[stack.length-2] === 'gml:geometryMember'){
      // Bisher vorandene feature in ein array schreiben
      feature.geometry = args.name;
        fs.appendFile('./hallo.xml',feature.geometry + '\n', function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
        });
    }
  })
  .on('tag-close', function(args) {
//    console.log(args);
    stack.pop();
  })
  .on('text', function(args) {
//    console.log(args);
    if (stack.join('/') === 'wfs:FeatureCollection/gml:boundedBy/gml:Box/gml:coordinates'){
//      console.log(args.text);
      feature.bbox_coord = args.text;
      json_str = 'BBox Coordinates ' + '\n' + feature.bbox_coord;
        fs.writeFile('./hallo.xml', json_str, function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
        });
    }
    if (stack[stack.length-1] === 'gml:coordinates'){
      // Bisher vorandene feature in ein array schreiben
      feature.coordinates = args.text;
       fs.appendFile('./hallo.xml',feature.coordinates + '\n', function (err) {
        if (err) throw err;
        console.log('The "data to append" was appended to file!');
        });
    }
  });



//fs.writeFile('./hallo.xml', json_str, function (err) {
//  if (err) throw err;
//  console.log('It\'s saved!');
//});
//write(feature.geometry, './hallo.xml');

// ATTRIB
//var str = ' href="213" src="test"', m;
//while (m = str.match(/\s*([a-z_:-]+)="([^"]*)"/)) {
//  console.log(m);
//  str = str.substring(m[0].length)
//};