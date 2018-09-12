'use strict'

const assert = require('assert')
const { test } = require('../../aladdin')
const baseType = require('./base')

test('should throw required error if data is not provided', () => {
  const rule = baseType().required()

  assert.throws(() => rule.validate(''), /field is required/)
})

test('should throw error if data is not in list of valid values', () => {
  const rule = baseType().allowed(['john', 'jane'])

  assert.throws(() => rule.validate('doe'), /field must be one of \[john,jane\]/)
})

test('should throw error if data is in list of disallowed values', () => {
  const rule = baseType().disallowed(['john', 'jane'])

  assert.throws(() => rule.validate('john'), /field must not be one of \[john,jane\]/)
})

test('should not throw error if data is undefined but a default is specified', () => {
  const rule = baseType().default('john doe')

  assert.doesNotThrow(() => rule.validate())
})

test('should return default value if data is undefined', () => {
  const defaultVal = 'john doe'
  const rule = baseType().default(defaultVal)

  const { data } = rule.validate()

  assert.equal(data, defaultVal)
})

test('should return validated data if it passes all requirements', () => {
  const rule = baseType().allowed(['john', 'jane']).required()

  const { data } = rule.validate('john')

  assert.equal(data, 'john')
})

