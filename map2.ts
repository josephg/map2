declare function require(name:string): any;

export = Map2

class Map2<K1, K2, V> {
  map: Map<K1, Map<K2, V>>
  size: 0

  static default = Map2

  /**
   * Create a new Map2. The constructor takes in an iterable of data values in
   * the form of [[k1, k2, v], [k1, k2, v], ...].
   */
  constructor(data?: [K1, K2, V][]) {
    this.map = new Map
    this.size = 0
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        this.set(d[0], d[1], d[2])
      }
    }  
  }
  
  /** Get k1, k2. Returns value or undefined. */
  get(k1: K1, k2: K2): V | undefined {
    let inner
    if ((inner = this.map.get(k1))) {
      return inner.get(k2)
    }
  }
  
  /** Check if the map contains (k1, k2). Returns true or false. */
  has(k1: K1, k2: K2): boolean {
    const inner = this.map.get(k1)
    return inner ? inner.has(k2) : false
  }

  /** Set (k1, k2) = v. Chainable - returns the set. */
  set(k1: K1, k2: K2, v: V): Map2<K1, K2, V> {
    let inner = this.map.get(k1)
    if (!inner) {
      inner = new Map
      this.map.set(k1, inner)
    }
    this.size -= inner.size
    inner.set(k2, v)
    this.size += inner.size
    return this
  }
  
  /**
   * Deletes the value for (k1, k2). Returns true if an element was removed,
   * false otherwise.
   */
  delete(k1: K1, k2: K2): boolean {
    const inner = this.map.get(k1);
    if (inner) {
      const deleted = inner.delete(k2);
      if (deleted) {
        this.size--;
      }
      return deleted;
    } else {
      return false;
    }
  }

  /** Remove all items in the map */
  clear() {
    this.map.clear();
    this.size = 0;
  }

  /**
   * Iterates through all values in the set via the passed function.
   *
   * **Warning:** Your function is called with arguments in order of (v, k1,
   * k2). This is to match the semantics of Map.forEach which passes (v, k).
   */
  forEach(fn: (v: V, k1: K1, v2: K2) => void) {
    this.map.forEach(function(inner, k1) {
      inner.forEach(function(v, k2) {
        fn(v, k1, k2)
      })
    })
  }


  /** Iterator to support for..of loops. Iterates over [k1, k2, v] triples. */
  *entries(): IterableIterator<[K1, K2, V]> {
    for (const [k1, inner] of this.map.entries()) {
      for (const [k2, v] of inner.entries()) {
        yield [k1, k2, v]
      }
    }
  }
  
  /** Iterate over [k1, k2, v] triples */
  [Symbol.iterator](): IterableIterator<[K1, K2, V]> {
    return this.entries()
  }

  /** Iterator over [k1, k2] pairs */
  *keys(): IterableIterator<[K1, K2]> {
    for (const [k1, inner] of this.map.entries()) {
      for (const k2 of inner.keys()) {
        yield [k1, k2]
      }
    }
  }

  /** Iterator over values */
  *values(): IterableIterator<V> {
    for (const inner of this.map.values()) {
      for (const v of inner.values()) {
        yield v
      }
    }
  }

  /** Helper for node so you can see the map in the repl. */
  [Symbol.for('nodejs.util.inspect.custom')](depth: number, options: any) {
    // This is a dirty hack to confuse browserify so it won't pull in node's util
    // library just to give us inspect.
    var inspect = require('' + 'util').inspect
    if (depth < 0) {
      return '[Map2]'
    }
    if (this.size === 0) {
      return '{[Map2]}'
    }
    var entries: string[] = []
    this.forEach(function(v, k1, k2) {
      entries.push("(" + (inspect(k1, options)) + "," + (inspect(k2, options)) + ") : " + (inspect(v, options)))
    })
    //assert(entries.length === this.size)
    return "{[Map2] " + (entries.join(', ')) + " }"
  }
}
