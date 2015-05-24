# Mocha tests
assert = require 'assert'

Map2 = require './map2'

mapWithData = ->
  m = new Map2
  m.set 1, 1, true
  m.set 1, 2, false
  m.set 2, 1, true
  m.set 2, 2, false
  m.set 3, 1, true
  m.set 3, 2, false

describe 'map2', ->
  it 'can store data', ->
    m = new Map2
    assert.equal m, m.set 1, 2, 3
    assert.equal 3, m.get 1, 2

  it 'updates the size correctly when items are set', ->
    m = new Map2
    assert.strictEqual m.size, 0
    m.set 1, 2, 3
    assert.strictEqual m.size, 1
    m.set 1, 2, 3
    m.set 1, 2, 4
    assert.strictEqual m.size, 1
    m.set 1, 3, 4
    assert.strictEqual m.size, 2
    m.delete 1, 3
    assert.strictEqual m.size, 1
    m.delete 1, 2
    assert.strictEqual m.size, 0

  it 'returns the correct value when you call delete', ->
    m = mapWithData()
    assert.equal true, m.delete(1, 1)
    assert.equal false, m.delete(1, 1)
    assert.equal true, m.delete(1, 2)
    assert.equal false, m.delete(1, 2)
    assert.equal false, m.delete(10, 10)

  it 'tells you if an item exists with has()', ->
    m = mapWithData()
    assert.equal true, m.has(1, 1)
    m.delete 1, 1
    assert.equal false, m.has(1, 1)
    m.delete 1, 2
    assert.equal false, m.has(1, 2)
    assert.equal false, m.has(10, 10)

  it 'has size 0 after clear()', ->
    m = mapWithData()
    assert.strictEqual m.size, 6
    m.clear()
    assert.strictEqual m.size, 0

  it 'iterates through all items in forEach', ->
    m = mapWithData()
    num = 0
    m.forEach (v, k1, k2) ->
      assert k1 in [1,2,3]
      assert k2 in [1,2]
      assert.equal v, true if k2 is 1
      assert.equal v, false if k2 is 2
      num++

    assert.equal num, 6

  describe 'iterator', ->
    it 'iterates through nothing if the map is empty', ->
      m = new Map2
      iter = m.entries()
      assert iter.next().done

    it 'iterates through all items', ->
      m = mapWithData()
      num = 0
      iter = m[Symbol.iterator]()
      assert.equal iter[Symbol.iterator](), iter
      while !(vs = iter.next()).done
        [k1, k2, v] = vs.value
        assert k1 in [1,2,3]
        assert k2 in [1,2]
        assert.equal v, true if k2 is 1
        assert.equal v, false if k2 is 2
        num++
      assert.equal num, 6

    it 'iterates through values with .values()', ->
      m = new Map2
      m.set 1, 2, 3
      m.set 1, 3, 5
      m.set 2, 2, 3

      iter = m.values()
      assert.equal iter[Symbol.iterator](), iter

      num = 0
      while !(vs = iter.next()).done
        assert vs.value in [3, 5]
        num++

      assert.equal num, 3
      
