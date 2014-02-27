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
          nodeName = null, attributes, nodeValue;

        while (m = str.match(/(.*?)<(\/)?([a-z_:-]+)([^>]*)(\/)?>/i)) {
          nodeValue  = m[1];

          if (nodeValue && nodeName) {
            e.emit('text', { nodeName: nodeName, nodeValue: nodeValue.replace(/^\s+|\s+$/g, '') });
          }

          nodeName   = m[3];
          attributes = m[4];

          if (m[2]) {
            e.emit('tagclose', { nodeName: nodeName });
          } else if (m[5]) {
            e.emit('tagopen', { nodeName: nodeName, attributes: attributes });
            e.emit('tagclose', { nodeName: nodeName });
          } else {
            e.emit('tagopen', { nodeName: nodeName, attributes: attributes });
          }

          str = str.substring(m[0].length);
        }
      })
      .on('end', function () {
        e.emit('end');
      });
  });

  return e;
};
