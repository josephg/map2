# Mocha tests
assert = require 'assert'

Map2 = require './map2'

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

  it 'has size 0 after clear()', ->
    m = new Map2
    m.set 1, 2, true
    m.set 1, 3, true
    m.set 2, 2, true
    m.set 2, 3, true
    m.set 3, 1, true
    assert.strictEqual m.size, 5
    m.clear()
    assert.strictEqual m.size, 0

  it 'iterates through all items in forEach', ->
    m = new Map2
    m.set 1, 1, true
    m.set 1, 2, false
    m.set 2, 1, true
    m.set 2, 2, false
    m.set 3, 1, true
    m.set 3, 2, false

    num = 0
    m.forEach (v, k1, k2) ->
      assert k1 in [1,2,3]
      assert k2 in [1,2]
      assert.equal v, true if k2 is 1
      assert.equal v, false if k2 is 2
      num++

    assert.equal num, 6




