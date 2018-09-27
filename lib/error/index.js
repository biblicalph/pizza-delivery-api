'use strict'

const hop = require('../hop')

const detailsSchema = {
  message: hop.string().required(),
  field: hop.string().required(),
  value: hop.string().default('')
}

/**
 * Create an error
 * @param {Object} options
 * @param {String} options.message - the error message
 * @param {String} [options.name='CustomError'] - the error object name
 * @param {String} [options.code='CUSTOM_ERROR'] - the error code
 * @return {Object} the error object
 */
const customError = ({ message, name='CustomError', code = 'CUSTOM_ERROR' }) => {
  const error = new Error(message)
  error.name = name
  error.code = code

  Error.captureStackTrace(error, customError)

  return error
}

/**
 * Ensure each entry in the details field has message, field and value properties
 * @param {Array<Object>} details 
 * @return {Object}
 * @throws {Object} an error object
 */
const ensureHasCorrectFieldsInDetails = details => {
  return details.map(detail => {
    const { value, error }  = hop.validate(detail, detailsSchema)

    if (error) throw error

    return value
  })
}

/**
 * Create a validation error
 * @param {Object} options
 * @param {String} [options.message] - the error message
 * @param {String} [options.details=[]] - the error details
 * @return {Object} the error object
 */
const validationError = ({ message, details = [] }) => {
  const error = customError({ message, name: 'ValidationError', code: 'VALIDATION_ERROR' })
  error.details = ensureHasCorrectFieldsInDetails(details)

  return error
}

module.exports = Object.create({
  customError,
  validationError
})