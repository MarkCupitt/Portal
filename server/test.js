var fs     = require('fs');
var util   = require('util');
var events = require('events');
var config = require('./config.js');

//*****************************************************************************

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

var pgUsername = 'test_user',       // your postgres user name
    pgPassword = 'test1234',        // your postgres user password
    pgHost     = 'localhost:5432',  // your postgres host and optionally port
    pgDatabase = 'test_db';         // your postgres database name

var pg = require('pg');

var sql = new pg.Client('postgres://' + pgUsername + ':' + pgPassword + '@' + pgHost + '/' + pgDatabase);
sql.connect();

var query = 'SELECT descr AS descr FROM service';

sql.query(query, function(err, res) {
//    console.log(query);
    sql.end();
    for (var i = 0, il = res.rows.length; i < il; i++) {
//      console.log(res.rows[i].descr);
    }
});




var childstr = child.toString();
var coords = childstr.split(',');

//console.log('\007\007done in ' + ((Date.now()-startDate) / 1000).toFixed(2) + 's');

// STREAM

//var read_stream = fs.createReadStream('./test.xml');
var write_stream = fs.createWriteStream('./test_writestream.xml');
write_stream.write(chunk);
write_stream.end();
write_stream.on('finish', function() {
//    console.log('alle Daten geschrieben');
  });

read_stream.on('end', function() {
  console.log('keine weiteren Daten');
});
