var util   = require('util');
var events = require('events');
var http   = require('http');

var XmlHttpStream = exports.get = function(url) {
  var e = new events.EventEmitter();

  var str = '';
  http.get(url, function(res) {
    res
      .on('data', function(buffer) {
        str += buffer.toString();

        var
          m,
          nodeName;

        while (m = str.match(/(.*?)<(\/)?([a-z_:-]+)([^>]*)(\/)?>/i)) {
          if (m[1] !== '') {
            if (nodeName !== undefined) {
              e.emit('text', { name: nodeName, text: m[1].replace(/^\s+|\s+$/g, '') });
            }
          }
          if (m[2]) {
            e.emit('tag-close', { name: m[3] });
          } else if (m[5]) {
            nodeName = m[3];
            e.emit('tag-open', { name: nodeName, attributes: m[4] });
            e.emit('tag-close', { name: nodeName });
          } else {
            nodeName = m[3];
            e.emit('tag-open', { name: nodeName, attributes: m[4] });
          }
          str = str.substring(m[0].length);
        }
      })
      .on('close', function () {
        e.emit('end');
      });
  });

  return e;
};
