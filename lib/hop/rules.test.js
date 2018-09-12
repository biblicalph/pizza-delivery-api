'use strict'

const assert = require('assert')
const { test } = require('../aladdin')
const rules = require('./rules')

const tests = {}

tests.requiredTests = () => {
  test('should throw error if data is undefined', () => {
    assert.throws(() => rules.required(), /field is required/)
  })

  test('should throw error if data is null', () => {
    assert.throws(() => rules.required(null), /field is required/)
  })

  test('should throw error if data is an empty string', () => {
    assert.throws(() => rules.required(''), /field is required/)
  })

  test('should return data if it passes validation', () => {
    const data = rules.required('something')

    assert.equal(data, 'something')
  })
}

tests.runValidateAsStringTests = () => {
  test('should throw error if data is not a string', () => {
    assert.throws(() => rules.validateAsString(50.5), /field must be a string/)
  })

  test('should return the data if it is a string', () => {
    const data = rules.validateAsString('something')

    assert.equal(data, 'something')
  })
}

tests.runValidateAsInt = () => {
  test('should throw error if data is a real number', () => {
    assert.throws(() => rules.validateAsInt(50.5), /field must be an integer/)
  })

  test('should throw error if data is not an integer', () => {
    assert.throws(() => rules.validateAsInt('some'), /field must be an integer/)
  })

  test('should return data if it is an integer', () => {
    const data = rules.validateAsInt('50')
    
    assert.equal(data, 50)
  })
}

tests.runValidateAsFloat = () => {
  test('should throw error if data is not a number', () => {
    assert.throws(() => rules.validateAsNumber('some'), /field must be a number/)
  })

  test('should throw error if data is an empty string', () => {
    assert.throws(() => rules.validateAsNumber(''), /field must be a number/)
  })

  test('should return data if it is an real number', () => {
    const data = rules.validateAsNumber('50.5')
    
    assert.equal(data, 50.5)
  })
}

tests.runEmailTests = () => {
  test('should throw error if data is not a valid email', () => {
    assert.throws(() => rules.email('some.com'), /field is not a valid email address/)
  })

  test('should return data if it is a valid email', () => {
    const data = rules.email('some@mail.com')

    assert.equal(data, 'some@mail.com')
  })
}

tests.runTrimTests = () => {
  test('should trim spaces from data', () => {
    const data = rules.trim(' something ')

    assert.equal(data, 'something')
  })
}

tests.runValidTests = () => {
  const allowed = ['john', 'jane']

  test('should throw error if data is not in allowed values', () => {
    assert.throws(() => rules.valid(allowed)('doe'), /field must be one of \[john,jane\]/)
  })

  test('should return data if it is in allowed list', () => {
    const data = rules.valid(allowed)('john')

    assert.equal(data, 'john')
  })
}

tests.runInvalidTests = () => {
  const disallowed = ['john', 'jane']

  test('should throw error if data is in disallowed values', () => {
    assert.throws(() => rules.invalid(disallowed)('john'), /field must not be one of \[john,jane\]/)
  })

  test('should return data if it is not in disallowed list', () => {
    const data = rules.invalid(disallowed)('doe')

    assert.equal(data, 'doe')
  })
}

tests.runMinTests = () => {
  test('should throw error if string length is less than min length', () => {
    assert(() => rules.min(5)('some'), /field must have at least 5 characters/)
  })

  test('should throw error if number is less than min val', () => {
    assert(() => rules.min(3)(2), /field must be greater than or equal to 3/)

  })

  test('should throw error if data is not a number or string', () => {
    assert(() => rules.min(3)(null), /field must be a string/)
  })
}

tests.runMaxTests = () => {
  test('should throw error if string length exceeds max length', () => {
    assert(() => rules.max(3)('something'), /field must have at most 3 characters/)
  })

  test('should throw error if number is greater than max val', () => {
    assert(() => rules.max(3)(4), /field must be less than or equal to 3/)

  })

  test('should throw error if data is not a number or string', () => {
    assert(() => rules.min(3)(null), /field must be a string/)
  })
}

// Run the tests
function run() {
  Object.keys(tests).forEach(key => tests[key]())
}

run()

