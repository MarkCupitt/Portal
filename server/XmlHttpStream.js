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
          nodeName, attributes, nodeValue;

        while (m = str.match(/(.*?)<(\/)?([a-z_:-]+)([^>]*)(\/)?>/i)) {
          nodeName = m[3] || null;
          attributes = m[4] || {};
          nodeValue = m[1] || '';

          if (nodeValue && nodeName) {
            e.emit('text', { nodeName: nodeName, text: nodeValue.replace(/^\s+|\s+$/g, '') });
          }

          if (m[2]) {
            e.emit('tag-close', { nodeName: nodeName });
          } else if (m[5]) {
            e.emit('tag-open', { nodeName: nodeName, attributes: attributes });
            e.emit('tag-close', { nodeName: nodeName });
          } else {
            e.emit('tag-open', { nodeName: nodeName, attributes: attributes });
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
