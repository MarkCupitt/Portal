var proj4js     = require('proj4');
var projections = require('./projections.js');

var BBox = function(bbox, srs) {
  if (bbox === undefined || bbox.n === undefined || bbox.e === undefined || bbox.s === undefined || bbox.w === undefined) {
    return null;
	}

  return {
    project: function(srs) {
      var
        sw = proj4js(projections[this.srs], projections['EPSG:25833'], [ this.w, this.s ]),
        ne = proj4js(projections[this.srs], projections['EPSG:25833'], [ this.e, this.n ]);
      return BBox({ n:ne[1], e:ne[0], s:sw[1], w:sw[0] }, srs);
    },

    toString: function(pattern, precision) {
      var self = this;
      pattern   = pattern   || 'n,e,s,w';
      precision = precision || 6;
      return pattern.replace(/([nesw])/g, function(key) {
        return self[key].toFixed(precision) || key;
      });
    },

    n: parseFloat(bbox.n),
    e: parseFloat(bbox.e),
    s: parseFloat(bbox.s),
    w: parseFloat(bbox.w),

    srs: srs || 'EPSG:4326'
  };
};

exports.BBox = BBox;
