var fs = require('fs');

//*****************************************************************************

var config = require('./config.js');
//console.log(config);

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

console.log('\007\007done in ' + ((Date.now()-startDate) / 1000).toFixed(2) + 's');

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




/*
var pgUsername = '',               // your postgres user name
    pgPassword = '',               // your postgres user password
    pgHost     = 'localhost:5432', // your postgres host and optionally port
    pgDatabase = 'postgis20';      // your postgres database name

var pg = require('pg');

var sql = new pg.Client('postgres://' + pgUsername + ':' + pgPassword + '@' + pgHost + '/' + pgDatabase);
sql.connect();

var query =
    'SELECT' +
    ' ' + pgHeightField + ' AS height,' +
    ' ' + pgMinHeightField + ' AS min_height,' +
    '   ST_AsText(ST_ExteriorRing(' + pgFootprintField + ')) AS footprint' +
    ' FROM ' + pgTable +
    ' ORDER BY height DESC'
;

sql.query(query, function(err, res) {
    sql.end();
    for (var i = 0, il = res.rows.length; i < il; i++) {
      //...
    }
});
*/

var XML = require('node-jsxml').XML;
var x = new XML(read('hausumringe.xml'));
console.log(x.toXMLString());