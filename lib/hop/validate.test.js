'use strict'

const assert = require('assert')
const { test, beforeEach } = require('../aladdin')
const hop = require('./')
const validate = require('./validate')

let data, schema

beforeEach(() => {
  data = {
    name: ' john doe',
    email: 'john@doe.com',
    age: 55
  }
  schema = {
    name: hop.string().trim().required(),
    email: hop.string().email().required(),
    age: hop.number().int().min(18).required()
  }
})

test('should validate with hop schema and return an object containing "error" and "value"', () => {
  const result = validate('something', hop.string().required())

  assert.ok(result.hasOwnProperty('error'))
  assert.ok(result.hasOwnProperty('value'))
})

test('should validate with object of hop schemas and return an object containing "error" and "value"', () => {
  const result = validate(data, schema)

  assert.ok(result.hasOwnProperty('error'))
  assert.ok(result.hasOwnProperty('value'))
})

test('should contain an error in the "error" property if validation fails', () => {
  data.name = ' '

  const {error} = validate(data, schema)

  assert.ok(error instanceof Error)
})

test('should contain "details" field in "error" object', () => {
  data.name = ' '
  data.age = 17

  const {error} = validate(data, schema)

  assert.ok(error.details.length === 2)
})

test('should have "field", "value" and "message" property in each detail', () => {
  data.name = ' '
  data.age = 17

  const {error} = validate(data, schema)

  const expectedFields = ['field', 'value', 'message']
  error.details.forEach(detail => {
    const fields = Object.keys(detail)
    
    assert.ok(fields.length === 3)
    fields.forEach(field => assert.ok(expectedFields.includes(field)))
  })
})

test('should return the correct validation errors in details field', () => {
  data.name = ' '
  data.age = 17

  const {error} = validate(data, schema)

  const expected = [
    {field: 'name', msg: '"name" is required'}, 
    {field: 'age', msg: '"age" must be greater than or equal to 18'}
  ]
  expected.forEach(({field, msg}) => {
    const errDetail = error.details.find(detail => {
      return detail.field === field
    })

    assert.equal(errDetail.message, msg)
  })
})

test('should contain the validated data in the "value" property', () => {
  const {value} = validate(data, schema)

  const expected = {
    name: data.name.trim(),
    email: data.email,
    age: data.age
  }

  assert.deepEqual(value, expected)
})