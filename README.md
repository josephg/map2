# Map2

This is a tiny library which exposes a javascript Map2 class. ES6 Map maps from
k -> v. Map2 maps from (k1, k2) -> v.

It exposes the same set of methods as normal javascript maps.

It depends on the javascript Map class, so its avaliable in NodeJS 0.12, IoJS and any [modern browser](https://kangax.github.io/compat-table/es6/#Map).

```
% npm install map2
```

## A quick tour:

```javascript
var Map2 = require('map2');

var m = new Map2;
m.set(1, 2, 3); // Chainable. Returns m.

m.get(1, 2); // Returns 3.

var obj1 = {x:5};
var obj2 = ['an','array'];
m.set(obj1, obj2, "oh hi");

m.get(obj1, obj2); // Returns "oh hi".

m.size; // 2

m.has(obj1, obj2); // true

// To iterate, either use .forEach():
m.forEach(function(v, k1, v2) {
  // The callback takes the value first - which is weird, but matches the
  // semantics of Map#forEach.
  console.log(k1, k2, v); // Prints 1,2,3 then {x:5},['an','array'] 
});

// Or use the new es6 iterators.
for (var entry of m) {
  console.log(entry); // An array of [k1, k2, v]
}

for (var ks of m.keys()) {
  console.log(ks); // An array of [k1, k2]
}

for (var v of m.values()) {
  console.log(v); // A value.
}

// To delete things, you can either delete items individually:
m.delete(1, 2); // returns true if something was deleted.

// Or delete everything all at once:
m.clear();
m.size; // 0.
```

---

License: ISC.
