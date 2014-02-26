var XmlHttpStream = require('XmlHttpStream.js');
var fs = require('fs');

var url = "http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:3068";

var stack    = [];
var feature  = {};
var json_str = '';

var xml = XmlHttpStream.get(url)
  .on('tag-open', function(args) {
    stack.push(args.name);

    if (args.name === 'gml:featureMember'){
      feature = {};
    }

    if (stack[stack.length-2] === 'gml:geometryMember'){
      feature.geometry = args.name;
        fs.appendFileSync('./hallo.xml',feature.geometry + '\n', function (err) {
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
       fs.appendFileSync('./hallo.xml',feature.coordinates + '\n', function (err) {
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