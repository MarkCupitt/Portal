var http = require('http');

var HttpReader = function(url) {
  this.readable = true;

  http.get(url, function(httpStream) {
    console.log(url);
	httpStream
      .on('data', function(data) {
        this.emit('data', data);
      }.bind(this))
      .on('end', function() {
        this.emit('end');
      }.bind(this));
  }.bind(this));
};

require('util').inherits(HttpReader, require('stream'));
var proto = HttpReader.prototype;

 proto.end = function() {
   this.emit('end');
 };

exports.reader = HttpReader;
