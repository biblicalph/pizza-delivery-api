'use strict'

const assert = require('assert')
const { test } = require('../aladdin')
const rules = require('./rules')

const tests = {}

tests.requiredTests = () => {
  test('should throw required error if data is undefined', () => {
    assert.throws(() => rules.required({}), /field is required/)
  })

  test('should throw required error if data is null', () => {
    assert.throws(() => rules.required({ data: null }), /field is required/)
  })

  test('should throw required error if data is an empty string', () => {
    assert.throws(() => rules.required({ data: '' }), /field is required/)
  })

  test('should return data if it passes validation', () => {
    const data = rules.required({ data: 'something' })

    assert.equal(data, 'something')
  })
}

tests.runValidateAsStringTests = () => {
  test('should throw error if data is not a string', () => {
    assert.throws(() => rules.validateAsString({ data: 50.5 }), /field must be a string/)
  })

  test('should throw error if data is "null" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.throws(() => rules.validateAsString({ data: null, flags }), /field must be a string/)
  })


  test('should return the data if it is a string', () => {
    const data = rules.validateAsString({ data: 'something' })

    assert.equal(data, 'something')
  })

  test('should return data if "undefined" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.equal(rules.validateAsString({ flags }), undefined)
  })
}

tests.runValidateAsInt = () => {
  test('should throw error if data is a real number', () => {
    assert.throws(() => rules.validateAsInt({ data: 50.5 }), /field must be an integer/)
  })

  test('should throw error if data is "null" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.throws(() => rules.validateAsInt({ data: null, flags }), /field must be an integer/)
  })


  test('should throw error if data is a string', () => {
    assert.throws(() => rules.validateAsInt({ data: 'some' }), /field must be an integer/)
  })

  test('should return data if it is an integer', () => {
    const data = rules.validateAsInt({ data: '50' })
    
    assert.equal(data, 50)
  })

  test('should return data if it is "undefined" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.equal(rules.validateAsInt({ flags }), undefined)
  })
}

tests.runValidateAsFloat = () => {
  test('should throw error if data is not a number', () => {
    assert.throws(() => rules.validateAsNumber({ data: 'some' }), /field must be a number/)
  })

  test('should throw error if data is "null" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.throws(() => rules.validateAsNumber({ data: 'some', flags }), /field must be a number/)
  })


  test('should throw error if data is an empty string', () => {
    assert.throws(() => rules.validateAsNumber({ data: '' }), /field must be a number/)
  })

  test('should return data if it is an real number', () => {
    const data = rules.validateAsNumber({ data: '50.5' })
    
    assert.equal(data, 50.5)
  })

  test('should return data if it is "undefined" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.equal(rules.validateAsNumber({ flags }), undefined)
  })
}

tests.runEmailTests = () => {
  test('should throw error if data is not a valid email', () => {
    assert.throws(() => rules.email({ data: 'some.com' }), /field is not a valid email address/)
  })

  test('should return data if it is a valid email', () => {
    const data = rules.email({ data: 'some@mail.com' })

    assert.equal(data, 'some@mail.com')
  })

  test('should return data if it is "undefined" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.equal(rules.email({ flags }), undefined)
  })
}

tests.runTrimTests = () => {
  test('should trim spaces from data', () => {
    const data = rules.trim({ data: ' something ' })

    assert.equal(data, 'something')
  })
}

tests.runValidTests = () => {
  const allowed = ['john', 'jane']

  test('should throw error if data is not in allowed values', () => {
    assert.throws(() => rules.valid(allowed)({ data: 'doe' }), /field must be one of \[john,jane\]/)
  })

  test('should return data if it is in allowed list', () => {
    const data = rules.valid(allowed)({ data: 'john' })

    assert.equal(data, 'john')
  })
}

tests.runInvalidTests = () => {
  const disallowed = ['john', 'jane']

  test('should throw error if data is in disallowed values', () => {
    assert.throws(() => rules.invalid(disallowed)({ data: 'john' }), /field must not be one of \[john,jane\]/)
  })

  test('should return data if it is not in disallowed list', () => {
    const data = rules.invalid(disallowed)({ data: 'doe' })

    assert.equal(data, 'doe')
  })
}

tests.runMinTests = () => {
  test('should throw error if string length is less than min length', () => {
    assert.throws(() => rules.min(5)({ data: 'some' }), /field must have at least 5 characters/)
  })

  test('should throw error if number is less than min val', () => {
    assert.throws(() => rules.min(3)({ data: 2 }), /field must be greater than or equal to 3/)

  })

  test('should throw error if data is not a number or string', () => {
    assert.throws(() => rules.min(3)({ data: null }), /field must have at least 3 characters/)
  })

  test('should return the string if it\'s length is greater than or equal to min length', () => {
    assert.equal(rules.min(3)({ data: 'some' }), 'some')
  })

  test('should return the number if it is greater than or equal to min val', () => {
    assert.equal(rules.min(3)({ data: 3 }), 3)
  })

  test('should return the data if it is "undefined" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.equal(rules.min(3)({ flags }), undefined)
  })
}

tests.runMaxTests = () => {
  test('should throw error if string length exceeds max length', () => {
    assert.throws(() => rules.max(3)({ data: 'something' }), /field must have at most 3 characters/)
  })

  test('should throw error if number is greater than max val', () => {
    assert.throws(() => rules.max(3)({ data: 4 }), /field must be less than or equal to 3/)

  })

  test('should throw error if data is not a number or string', () => {
    assert.throws(() => rules.min(3)({ data: null }), /field must have at least 3 characters/)
  })

  test('should return the string if it\'s length is less than or equal to max val', () => {
    assert.equal(rules.max(4)({ data: 'some' }), 'some')
  })

  test('should return the number if it is less than or equal to max val', () => {
    assert.equal(rules.max(4)({ data: 3 }), 3)
  })

  test('should return the data if it is "undefined" but optional flag is provided', () => {
    const flags = { optional: true }
    assert.equal(rules.max(4)({ flags }), undefined)
  })
}

// Run the tests
function run() {
  Object.keys(tests).forEach(key => tests[key]())
}

run()

