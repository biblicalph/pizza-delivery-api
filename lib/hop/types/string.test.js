'use strict'

const assert = require('assert')
const { test } = require('../../aladdin')
const stringType = require('./string')

test('should throw error if data is not a string', () => {
  const rule = stringType()
  assert.throws(() => rule.validate(), /field must be a string/)
})

test('should throw error if number of characters in data is less than min value', () => {
  const rule = stringType().min(4)
  assert.throws(() => rule.validate('can'), /field must have at least 4 characters/)
})

test('should throw error if number of characters in data is greater than max value', () => {
  const rule = stringType().max(5)
  assert.throws(() => rule.validate('something'), /field must have at most 5 characters/)
})

test('should throw error if data is not a valid email', () => {
  const rule = stringType().email()

  assert.throws(() => rule.validate('mak.com'), /field is not a valid email address/)
})

test('should not throw error if data passes validation', () => {
  const rule = stringType().min(3).max(15).trim().email().required()

  const { data } = rule.validate(' john@mail.com ')

  assert.equal(data, 'john@mail.com')
})
