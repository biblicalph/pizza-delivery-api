'use strict'

const utils = require('./utils')

function createValidationError(details) {
  const err = Error('Validation Error')
  err.isHop = true
  err.details = details

  return err
}

/**
 * Helper function for validating data using a hop schema
 * @param {Object} options
 * @param {*} options.data - the data to validate
 * @param {Object} options.schema - the validator schema
 * @param {String} [options.field] - the field being validated
 * @return {Object} result
 * @return {Object} result.error - the validation error 
 */
function validateWithHop({data, schema, field}) {
  try {
    const { data: validatedData } = schema.validate(data, field)

    return { error: null, value: validatedData }
  } catch (error) {
    return { 
      value: data,
      error: {
        field,
        message: error.message,
        value: data
      }
    }
  }
}

/**
 * Validate data using a object containing schema types
 * @param {*} data - the data to validate
 * @param {*} schema - an object whose properties map to schema objects
 * @return {Object} result
 * @return {Object} result.value - the validated data
 * @return {Object|null} result.error - the validation error object
 */
function validateWithObjectOfHopSchema(data, schema) {
  let validatedData = {}
  let errors = []

  Object.keys(schema).forEach(field => {
    const {error, value} = validateWithHop({data: data[field], schema: schema[field], field})

    error && errors.push(error)
    validatedData[field] = value
  })

  return {
    value: validatedData || data,
    error: errors.length ? createValidationError(errors) : null
  }
}

/**
 * Validate the data using a hop schema
 * @param {*} data 
 * @param {*} schema 
 * @return {Object} result
 * @return {Object} result.value - the validated data
 * @return {Object|null} result.error - the validation error object
 */
function validateWithHopSchema(data, schema) {
  const {error, value: validatedData} = validateWithHop({data, schema})

  return {
    value: validatedData || data,
    error: error ? createValidationError([error]) : null
  }
}

/**
 * Returns true if schema is of type hop
 * @param {Object} schema 
 * @return {boolean}
 */
function isHopSchema(schema) {
  return utils.isObject(schema) && !!schema.isHop
}

/**
 * Validate the provided data using the specified schema
 * @param {*} data - the data to validate
 * @param {*} schema - the validation schema or object whose properties contain validation schemas
 * @return {Object} result
 * @return {Object} result.value - the validated data
 * @return {Object|null} result.error - the validation error object
 */
module.exports = function validate(data, schema) {
  return isHopSchema(schema) ? validateWithHopSchema(data, schema) : validateWithObjectOfHopSchema(data, schema)
}