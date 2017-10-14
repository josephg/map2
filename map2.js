module.exports = Map2;

// Create a new Map2. The constructor takes in an iterable of data values in
// the form of [[k1, k2, v], [k1, k2, v], ...].
function Map2(data) {
  this.map = new Map;
  this.size = 0;
  if (data) {
    for (var i = 0; i < data.length; i++) {
      var d = data[i];
      this.set(d[0], d[1], d[2]);
    }
  }
}

// Get k1, k2. Returns value or undefined.
Map2.prototype.get = function(k1, k2) {
  var inner;
  if ((inner = this.map.get(k1))) {
    return inner.get(k2);
  }
};

// Does the map have k1, k2. Returns true / false.
Map2.prototype.has = function(k1, k2) {
  var inner = this.map.get(k1);
  return inner ? inner.has(k2) : false;
};

// Set (k1, k2) -> v. Chainable - returns the set.
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

// Deletes the value for (k1, k2). Returns true if an element was removed,
// false otherwise.
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

// Remove all items in the map.
Map2.prototype.clear = function() {
  this.map.clear();
  this.size = 0;
};


// Iterates through all values in the set via the passed function. Note the
// order of arguments - your function is called with (v, k1, k2). This is to
// match the semantics of Map.forEach which passes (v, k).
Map2.prototype.forEach = function(fn) {
  this.map.forEach(function(inner, k1) {
    inner.forEach(function(v, k2) {
      fn(v, k1, k2);
    });
  });
};

if (typeof Symbol !== 'undefined') {
  function iterWithNext(next) {
    var iter = {};
    iter.next = next;
    iter[Symbol.iterator] = function() { return iter; };
    return iter;
  }

  // Iterator to support for..of loops
  Map2.prototype[Symbol.iterator] = Map2.prototype.entries = function() {
    var outer = this.map.entries();

    var k1;
    var inner = null;

    return iterWithNext(function() {
      var innerV;
      while (inner == null || (innerV = inner.next()).done) {
        // Go to the next outer map.
        var outerV = outer.next();
        // We need to return {done:true} - but this has the object we want.
        if (outerV.done) return outerV;

        k1 = outerV.value[0];
        inner = outerV.value[1].entries();
      }

      // Ok, innerV should now contain [k2, v].
      var k2 = innerV.value[0];
      var v = innerV.value[1];

      return {value:[k1, k2, v], done: false};
    });
  };

  // Iterate through all keys pairwise
  Map2.prototype.keys = function() {
    var iter = this.entries();
    return iterWithNext(function() {
      var v = iter.next();
      if (v.done) {
        return v;
      } else {
        return {value:[v.value[0], v.value[1]], done:false};
      }
    });
  };

  // Iterate through all values
  Map2.prototype.values = function() {
    var iter = this.entries();
    return iterWithNext(function() {
      var v = iter.next();
      if (v.done) {
        return v;
      } else {
        return {value:v.value[2], done:false};
      }
    });
  };
}

// Helper for node / iojs so you can see the map in the repl.
Map2.prototype.inspect = function(depth, options) {
  // This is a dirty hack to confuse browserify so it won't pull in node's util
  // library just to give us inspect.
  var inspect = require('' + 'util').inspect;
  if (depth < 0) {
    return '[Map2]';
  }
  if (this.size === 0) {
    return '{[Map2]}';
  }
  var entries = [];
  this.forEach(function(v, k1, k2) {
    entries.push("(" + (inspect(k1, options)) + "," + (inspect(k2, options)) + ") : " + (inspect(v, options)));
  });
  //assert(entries.length === this.size);
  return "{[Map2] " + (entries.join(', ')) + " }";
};

