module.exports = Map2;

// Create a new Map2. The constructor takes in an iterable of data values in
// the form of [[k1, k2, v], [k1, k2, v], ...].
function Map2(data) {
  this.map = new Map;
  this.size = 0;
  if (data) {
    for (var i = 0; i < data.length; i++) {
      var ref = data[i], k1 = ref[0], k2 = ref[1], v = ref[2];
      this.set(k1, k2, v);
    }
  }
}

Map2.prototype.get = function(k1, k2) {
  var inner;
  if ((inner = this.map.get(k1))) {
    return inner.get(k2);
  }
};

Map2.prototype.has = function(k1, k2) {
  var inner = this.map.get(k1);
  return inner ? inner.has(k2) : false;
};

Map2.prototype.set = function(k1, k2, v) {
  var inner = this.map.get(k1);
  if (!inner) {
    inner = new Map;
    this.map.set(k1, inner);
  }
  this.size -= inner.size;
  inner.set(k2, v);
  this.size += inner.size;
  return this;
};

Map2.prototype.delete = function(k1, k2) {
  var inner = this.map.get(k1);
  if (inner) {
    var deleted = inner.delete(k2);
    if (deleted) {
      this.size--;
    }
    return deleted;
  } else {
    return false;
  }
};

Map2.prototype.forEach = function(fn) {
  this.map.forEach(function(inner, k1) {
    inner.forEach(function(v, k2) {
      fn(v, k1, k2);
    });
  });
};

Map2.prototype.clear = function() {
  this.map.clear();
  this.size = 0;
};

Map2.prototype.inspect = function(depth, options) {
  var inspect = require('util').inspect;
  if (depth < 0) {
    return '[Map2]';
  }
  if (this.size === 0) {
    return '{[Map2]}';
  }
  var entries = [];
  this.forEach(function(k1, k2, v) {
    entries.push("(" + (inspect(k1, options)) + "," + (inspect(k2, options)) + ") : " + (inspect(v, options)));
  });
  //assert(entries.length === this.size);
  return "{[Map2] " + (entries.join(', ')) + " }";
};

