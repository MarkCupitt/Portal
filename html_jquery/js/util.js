var util = {
  nl2br: function(str) {
    if (typeof str === 'string') {
      return str.replace ? str.replace(/[\r\n]/g, '<br>') : str;
    }
  },

  ellipsis: function(str, len) {
    if (typeof str === 'string') {
      return (str.length > len) ? str.substr(0, len-2) +'…' : str;
    }
  },

  getUrlParams: function() {
    var res = {},
      query = location.search.replace(/^\?+/, ''),
      params = query.split('&'),
      pair;
    for (var i = 0, il = params.length; i < il; i++) {
      pair = params[i].split('=');
      res[ pair[0] ] = pair[1] || true;
    }
    return res;
  }
};
