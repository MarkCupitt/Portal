var XmlParser = function() {
  this.writable = true;
  this._str = '';
};

require('util').inherits(XmlParser, require('stream'));
var proto = XmlParser.prototype;

proto.write = function(buffer) {
  this._str += buffer.toString();

  var
    m,
    nodeName = null, attributes, nodeValue;

  while (m = this._str.match(/(.*?)<(\/)?([a-z_:-]+)([^>]*)(\/)?>/i)) {
    nodeValue  = m[1];

    if (nodeValue && nodeName) {
      this.emit('text', { nodeName: nodeName, nodeValue: nodeValue.replace(/^\s+|\s+$/g, '') });
    }

    nodeName   = m[3];
    attributes = m[4];

    if (m[2]) {
      this.emit('tagclose', { nodeName: nodeName });
    } else if (m[5]) {
      this.emit('tagopen', { nodeName: nodeName, attributes: attributes });
      this.emit('tagclose', { nodeName: nodeName });
    } else {
      this.emit('tagopen', { nodeName: nodeName, attributes: attributes });
    }

    this._str = this._str.substring(m[0].length);
  }
};

proto.end = function() {
  this.emit('end');
};

exports.parser = XmlParser;