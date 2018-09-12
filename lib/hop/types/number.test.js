'use strict'

const assert = require('assert')
const { test } = require('../../aladdin')
const numberType = require('./number')

test('should throw error if data is not a number', () => {
  const rule = numberType()
  assert.throws(() => rule.validate(''), /field must be a number/)
})

test('should throw error if data is less than min value', () => {
  const rule = numberType().min(4)
  assert.throws(() => rule.validate(3), /field must be greater than or equal to 4/)
})

test('should throw error if data is greater than max value', () => {
  const rule = numberType().max(5)
  assert.throws(() => rule.validate(6), /field must be less than or equal to 5/)
})

test('should throw error if data is not an integer', () => {
  const rule = numberType().integer()

  assert.throws(() => rule.validate(50.5), /field must be an integer/)
})

test('should throw error if data is not an integer', () => {
  const rule = numberType().int()

  assert.throws(() => rule.validate(50.5), /field must be an integer/)
})

test('should not throw error if data passes validation', () => {
  const rule = numberType().min(3).max(5).default(4).required()

  const { data } = rule.validate()

  assert.equal(data, 4)
})
