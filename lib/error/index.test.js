'use strict'

const assert = require('assert')
const { test, beforeEach } = require('../aladdin')
const { customError, validationError } = require('./')

let message, code, details
beforeEach(() => {
  message = 'Something Bad Happened'
  code = 'MY_ERROR_CODE'
  details = [{
    field: 'age',
    message: 'Age must be a number',
    value: 'something'
  }]
})

test('should return an error object', () => {
  const error = customError({ message })

  assert.ok(error instanceof Error)
})

test('should have a code field with value "CUSTOM_ERROR"', () => {
  const error = customError({ message })

  assert.equal(error.code, 'CUSTOM_ERROR')
})

test('should have a name field with value "CustomError"', () => {
  const error = customError({ message })

  assert.equal(error.name, 'CustomError')
})

test('should allow override of code field', () => {
  const error = customError({ code })

  assert.equal(error.code, code)
})

test('should exclude custom error function from stack trace', () => {
  try {
    throw customError({ message, code })
  } catch (error) {
    assert.ok(error.stack.includes('customError') === false)
  }
})

test('should return an error object with name "ValidationError', () => {
  const error = validationError({ message, details })

  assert.equal(error.name, 'ValidationError')
})

test('should return an error object with code "VALIDATION_ERROR', () => {
  const error = validationError({ message, details })

  assert.equal(error.code, 'VALIDATION_ERROR')
})

test('should include details field on returned error object', () => {
  const error = validationError({ message, details })

  assert.ok(error.hasOwnProperty('details'))
  assert.equal(error.details.length, 1)
  details.map((detail, i) => {
    assert.equal(error.details[i].message, detail.message)
    assert.equal(error.details[i].field, detail.field)
    assert.equal(error.details[i].value, detail.value)
  })
})

test('should throw error if entry in details does not have a "message" property', () => {
  delete details[0].message

  assert.throws(() => validationError({ message, details }), /Validation Error/)
})

test('should throw error if entry in details does not have a "field" property', () => {
  delete details[0].field

  assert.throws(() => validationError({ message, details }), /Validation Error/)
})

test('should not throw error if entry in details does not have a "value" property', () => {
  delete details[0].value

  assert.doesNotThrow(() => validationError({ message, details }))
})

test('should not throw error if value entry in details is null', () => {
  details[0].value = null

  assert.doesNotThrow(() => validationError({ message, details }))
})

test('should not throw error if value entry in details is undefined', () => {
  details[0].value = undefined

  assert.doesNotThrow(() => validationError({ message, details }))
})

test('should not throw error if value entry in details is an empty string', () => {
  details[0].value = ''

  assert.doesNotThrow(() => validationError({ message, details }))
})

