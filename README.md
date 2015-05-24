# Map2

This is a tiny library which exposes a javascript Map2 class. ES6 Map maps from
k -> v. Map2 maps from (k1, k2) -> v.

#### Why do you need this?

```javascript
var m = new Map;
m.set([x, y], "dance");
// ...
m.get([x, y]); // undefined! The new list isn't in the map :(
```

With Map2:

```javascript
var m = new Map2;
m.set(x, y, "dance");
// ...
m.get(x, y); // "dance" Woo!
```

The API is heavily based on the API for ES6 maps. Use `map.set(k1, k2, v)` to
set values and `map.get(k1, k2)` to get them back again.

The map API supports both `map.forEach` and the new `for (var e of map) { ...
}` syntax to iterate over maps. *Be careful with forEach* - your function is
called with arguments (v, k1, k2) to match the es6 maps. Its kind of weird, and
its tripped me up a few times.

This library depends on the javascript `Map` class, so its avaliable in NodeJS
0.12, IoJS and any [modern
browser](https://kangax.github.io/compat-table/es6/#Map). Any polyfill that
adds Map to the global object should work fine too.

Install it with:

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

// To delete things, you can either delete items individually:
m.delete(1, 2); // returns true if something was deleted.

// Or delete everything all at once:
m.clear();

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
```


# API

#### Constructor

The Map2 constructor makes a new Map2 and optionally initializes it with data.

```javascript
var Map2 = require('map2');
var map = new Map2;
```

Or with data:

```javascript
var Map2 = require('map2');

// Equalivant of calling map.set(1,2,3); map.set(4,5,6);
var map = new Map2([[1,2,3], [4,5,6]]);
```


#### map.set(key1, key2, value)

Set the tuple (key1, key2) to (value). Set returns the map, so you can chain it.

```javascript
map.set(1, 2, 3).set(4, 5, 6);

map.get(1, 2); // 3.
```


#### Map.get(key1, key2)

Get the value stored at the tuple (key1, key2). Note that maps use reference
equality, so identical object literals aren't treated the same.

Returns the value stored at (key1, key2) or undefined.

```javascript
map.set(1, 2, 3);
map.get(1, 2); // 3.

var o1 = {}, o2 = {};
map.set(o1, o2, 10);
map.get(o1, o2); // 10

// Note:
map.set({}, [], 10);
map.get({}, []); // undefined because {} and [] make new objects.
```


#### Map.delete(key1, key2)

Deletes the map entry (key1, key2). Returns true if an item was removed from
the map, false otherwise.


#### Map.clear()

Remove all objects from the map. After clear() is called, the object will have a size of 0.


#### Map.size

The number of entries in the map.

```javascript
map.size; // 0
map.set(1, 2, 3); // 1
map.set(1, 2, 5); // still 1
map.delete(1, 2); // 0
```


## Iterating

There are two ways to iterate through all the items in a Map2:

- Use map.forEach
- Use ES6 Iterators

I haven't done extensive performance testing, but until javascript iterators
are better optimized, forEach is probably going to be faster. (Using a closure
allocates a function, but using an iterator allocates an object for each
iteration of the loop).

Its currently undefined what happens if you add new items to a map while
iterating through it. (You may or may not see the new object). That said,
removing the item you're currently iterating through is ok.

The order of iteration is not guaranteed. Do not depend on it in any way. (If
you care about the order of your items, consider using an array instead).


#### Map.forEach(function(value, key1, key2) {...})

Call map.forEach to iterate through the map with a custom iterator function.
Note the order of arguments here is (value, key1, key2).


```javascript
map.set(1, 2, 3);
map.set(4, 5, 6);

map.forEach(function(value, key1, key2) {
  // Prints 1, 2, 3 and 4, 5, 6.
  console.log(key1, key2, value);
});
```


#### Map.entries()

Get an iterator for the entries in the map. Each entry in the result is an
array of [key1, key2, value]. Map.entries is also exposed via
`map[Symbol.iterator]` for usage in for..of loops.

```javascript
map.set(1, 2, 3);
map.set(4, 5, 6);

for (var entry of map) {
  // Prints 1, 2, 3 and 4, 5, 6.
  console.log(entry[0], entry[1], entry[2]);
}
```

Or awkwardly from Coffeescript:

```coffeescript
map.set 1, 2, 3
map.set 4, 5, 6

iter = map.entries()
while !(v = iter.next()).done
  [key1, key2, value] = v.value
  console.log key1, key2, value
```

From Coffeescript I recommend just sticking with `map.forEach (v, k1, k2) -> ...` until better syntax lands in coffeescript.


#### Map.values()

Returns an iterator which iterates over the values in the map. Note that this
iterator does not dedup values. The same value may appear multiple times in
the result.

```javascript
map.set(1, 2, 3);
map.set(4, 5, 6);

for (var v of map.values()) {
  // Prints 3 and 6.
  console.log(v);
}
```


#### Map.keys()

Returns an iterator over key pairs in the map. Keys are returned in an array of length 2. Map.keys is included for completeness and API similarity with the raw `Map` class, but you should probably just use `map.entries` instead.


---

## License

```
Copyright (c) 2015, Joseph Gentle <me@josephg.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```
