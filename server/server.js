var fs = require('fs');
var util   = require('util');
var events = require('events');

//*****************************************************************************

var config = require('./config.js');
//console.log(config.proj['EPSG:4326']);

// throw new Error('no import file given');

var options = {};
process.argv.splice(2).forEach(function(item) {
  var pairs = item.split('=')
  options[ pairs[0].replace(/^--/, '') ] = pairs.length > 1 ? pairs[1] : true;
});
// console.log(options);

//*****************************************************************************

var startDate = Date.now();

//*****************************************************************************


// process.exit();

function read(file) {
	return fs.readFileSync(file, 'utf8');
}

function write(str, file) {
	fs.writeFileSync(file, str, 'utf8');
}

function copy(srcFile, dstFile) {
  if (/\/$/.test(srcFile)) {
    eachFile(srcFile, function(file) {
      copy(srcFile + file, dstFile + file);
    });
    return;
  }
  fs.writeFileSync(dstFile, fs.readFileSync(srcFile));
}

function eachFile(path, callback) {
  var files = fs.readdirSync(path);
  files.forEach(function(file) {
    var stat = fs.lstatSync(path + file);
    if (stat.isFile()) {
      callback(file);
    }
  });
}

//copy('./', 'ertz/')

//write(fs.readFileSync('./capa.xml'), 'capa2.xml/');

var pgUsername = 'test_user',       // your postgres user name
    pgPassword = 'test1234',        // your postgres user password
    pgHost     = 'localhost:5432',  // your postgres host and optionally port
    pgDatabase = 'test_db';         // your postgres database name

var pg = require('pg');

var sql = new pg.Client('postgres://' + pgUsername + ':' + pgPassword + '@' + pgHost + '/' + pgDatabase);
sql.connect();

var query =
    'SELECT descr AS descr FROM service'
;

sql.query(query, function(err, res) {
//    console.log(query);
    sql.end();
    for (var i = 0, il = res.rows.length; i < il; i++) {
//      console.log(res.rows[i].descr);
    }
});

////var parseString = require('xml2js').parseString;
//var xml = fs.readFileSync('./test.xml');
////parseString(xml, function (err, result) {
////    console.log(result);
//////    console.log(result);
////});
//
//
//var xml2js = require('xml2js');
//var json ='';
//
//var parser = new xml2js.Parser();
//parser.addListener('end', function(result) {
//    console.dir(result);
//    console.log('Done.');
//});
//
//fs.readFile('./test.gml', function(err, data) {
//    parser.parseString(data);
//    json = JSON.stringify(data);
//    });



// COORD - TRANSFORM

var jsxml = require('node-jsxml');

var Namespace = jsxml.Namespace,
    QName = jsxml.QName,
    XML = jsxml.XML,
    XMLList = jsxml.XMLList;

var xml = new XML(fs.readFileSync('./test.xml', 'UTF8'));

//xml.addNamespace(new Namespace("wfs", "http://www.opengis.net/wfs"));
//xml.addNamespace(new Namespace("gml", "http://www.opengis.net/gml"));
//xml.addNamespace(new Namespace("fis", "http://www.berlin.de/broker"));
//

var child = xml.child('coordinates');
var a = xml.children();
console.log(a[1]);

//console.log(child.getValue());

var childstr = child.toString();
var coords = childstr.split(',');

var proj = require("proj4");

//console.log(proj(config.proj['EPSG:25833'], config.proj['EPSG:4326'], [parseFloat(coords[0]),parseFloat(coords[1])]));
//
//console.log('\007\007done in ' + ((Date.now()-startDate) / 1000).toFixed(2) + 's');



// STREAM

var http = require('http');

//var read_stream = fs.createReadStream('./test.xml');
var write_stream = fs.createWriteStream('./test_writestream.xml');

var adress = "http://fbinter.stadt-berlin.de/fb/wfs/geometry/senstadt/re_hausumringe?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&TYPENAME=fis:re_hausumringe&SRSNAME=EPSG:3068";

http.get(adress, function(res) {
//  console.log("Got response: " + res.statusCode);
  res.on('data', function(chunk) {

//    console.log('%d bytes wurden gelesen', chunk.length);
    write_stream.write(chunk);
  });

  res.on('end', function() {
//    console.log('keine weiteren Daten');

    var xml2 = new XML(fs.readFileSync('./test_writestream.xml', 'UTF8'));

    var children = xml2.child('*');
//    console.log(children);

  });

}).on('error', function(e) {
  console.log("Got error: " + e.message);
});




read_stream.on('data', function(chunk) {
  console.log('%d bytes wurden gelesen', chunk.length);
  write_stream.write(chunk);
  //write(chunk, './test_writefile.xml');

  write_stream.end();

  write_stream.on('finish', function() {
//    console.log('alle Daten geschrieben');
  });

});


read_stream.on('end', function() {
  console.log('keine weiteren Daten');
});

