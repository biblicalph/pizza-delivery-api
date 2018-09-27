'use strict'

const utils = require('./utils')

const W3C_HTML5_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const isOptional = flags => data => flags.optional && utils.isUndefined(data)

/**
 * Required validation rule
 * @param {Object} options
 * @param {*} options.data - the data to validate
 * @param {String} [options.field] - the name of the field being validated
 * @return {*} data if it is not empty (undefined or null)
 * @throws {Error} if data is empty
 */
const required = function({data, field}) {
  if (utils.isEmpty(data)) {
    const msg = field ? `"${field}" is required` : 'field is required'
    throw new Error(msg)
  }

  return data
}

/**
 * Validate data as a string
 * @param {Object} options
 * @param {*} options.data - the data to validate
 * @param {String} [options.field] - the name of the field being validated
 * @param {Object} [options.flags={}]
 * @return {String} data if it is a string
 * @throws {Error} if data is not a string
 */
const validateAsString = ({data, field, flags = {}}) => {
  if (isOptional(flags)(data) || utils.isString(data)) {
    return data
  }
  
  const msg = field ? `"${field}" must be a string` : 'field must be a string'
  throw new Error(msg)
}

/**
 * Validate data as an integer
 * @param {Object} options
 * @param {*} options.data - the data to validate
 * @param {String} [options.field] - the name of the field being validated
 * @param {Object} [options.flags = {}]
 * @return {Number} data
 * @throws {Error}
 */
const validateAsInt = ({data, field, flags = {}}) => {
  if (isOptional(flags)(data)) {
    return data
  } else if (utils.isInteger(data)) {
    return parseInt(data)
  }

  const msg = field ? `"${field}" must be an integer` : 'field must be an integer'
  throw new Error(msg)
}

/**
 * Validate data as a number
 * @param {Object} options
 * @param {*} options.data - the data to validate
 * @param {String} [options.field] - the name of the field being validated
 * @param {Object} [options.flags = {}]
 * @return {Number} data
 * @throws {Error}
 */
const validateAsNumber = ({data, field, flags = {}}) => {
  if (isOptional(flags)(data)) {
    return data
  } else if (utils.isNumber(data)) {
    return Number(data)
  }

  const msg = field ? `"${field}" must be a number` : 'field must be a number'
  throw new Error(msg)
}

/**
 * Create function for validating length of a string
 * @param {Number} minLen - the minimum length of the string
 * @return {Function}
 */
const validateMinStrLength = (minLen) => {
  /**
   * Ensure a string has at least minLen number of characters
   * @param {Object} options
   * @param {String} options.data - the data to validate
   * @param {String} [options.field] - the name of the field being validated
   * @param {Object} [options.flags={}]
   * @return {String} data
   * @throws {Error}
   */
  return ({data, field, flags = {}}) => {
    const hasRequiredLength = !utils.isEmpty(data) && data.length >= minLen
    if (isOptional(flags)(data) || hasRequiredLength) {
      return data
    }

    const msg = field
      ? `"${field}" must have at least ${minLen} characters` 
      : `field must have at least ${minLen} characters`

    throw new Error(msg)
  }
}

/**
 * Create function for validating minimum value of a number
 * @param {Number} minVal
 * @return {Function}
 */
const validateNumberMin = (minVal) => {
  /**
   * Ensure a number is greater than or equal to minVal
   * @param {Object} options
   * @param {*} options.data - the data to validate
   * @param {String} [options.field] - the name of the field being validated
   * @param {Object} [options.flags={}]
   * @return {Number} data
   * @throws {Error}
   */
  return ({data, field, flags = {}}) => {
    const isGreaterOrEqualToMin = utils.isNumber(data) && data >= minVal
    if (isOptional(flags)(data) || isGreaterOrEqualToMin) {
      return data
    }

    const msg = field
      ? `"${field}" must be greater than or equal to ${minVal}` 
      : `field must be greater than or equal to ${minVal}`

    throw new Error(msg)
  }
}

/**
 * Create function for validating minimum length of a string or minimum value of a number
 * @param {Number} minVal - the data to validate
 * @return {Function}
 */
const min = (minVal) => {
  if (!utils.isNumber(minVal)) {
    throw new Error(`${minVal} is not a number`)
  }
  const checkNumMin = validateNumberMin(Number(minVal))
  const checkStrLen = validateMinStrLength(Number(minVal))

  /**
   * Validate minimum length of a string or minimum value of a number
   * @param {Object} options
   * @param {*} options.data - the data to validate
   * @param {String} [options.field] - the name of the field being validated
   * @param {Object} [options.flags={}]
   * @return {Number|String} data
   * @throws {Error}
   */
  return ({data, field, flags={}}) => {
    if (utils.isNumber(data)) {
      return checkNumMin({data, field, flags})
    } 
    return checkStrLen({data, field, flags})
  }
}

/**
 * Create function for validating maximum length of a string
 * @param {Number} maxLen 
 * @return {Function}
 */
const validateMaxStrLength = (maxLen) => {
  /**
   * Validate maximum length of a string
   * @param {Object} options
   * @param {String} options.data - the data to validate
   * @param {String} [options.field] - the name of the field being validated
   * @param {Object} [options.flags={}]
   * @return {String} data
   * @throws {Error}
   */
  return ({data, field, flags = {}}) => {
    const hasRequiredLength = !utils.isEmpty(data) && data.length <= maxLen
    if (isOptional(flags)(data) || hasRequiredLength) {
      return data
    }

    const msg = field
      ? `"${field}" must have at most ${maxLen} characters` 
      : `field must have at most ${maxLen} characters`

    throw new Error(msg)
  }
}

/**
 * Create function for validating maximum value of a number
 * @param {Number} data 
 * @return {Function}
 */
const validateNumberMax = (maxVal) => {
  /**
   * Validate maximum value of a number
   * @param {Object} options
   * @param {Number} options.data - the data to validate
   * @param {String} [options.field] - the name of the field being validated
   * @param {Object} [options.flags={}]
   * @return {Number} data
   * @throws {Error}
   */
  return ({data, field, flags = {}}) => {
    const isLessOrEqualToMax = utils.isNumber(data) && data <= maxVal
    if (isOptional(flags)(data) || isLessOrEqualToMax) {
      return data
    }

    const msg = field
      ? `"${field}" must be less than or equal to ${maxVal}` 
      : `field must be less than or equal to ${maxVal}`

    throw new Error(msg)
  }
}

/**
 * Create function for validating maximum length of a string or maximum value of a number
 * @param {*} data - the data to validate
 * @return {Function}
 * @throws {Object} error
 */
const max = (maxVal) => {
  if (!utils.isNumber(maxVal)) {
    throw new Error(`${maxVal} is not a number`)
  }
  const checkStrMax = validateMaxStrLength(Number(maxVal))
  const checkNumMax = validateNumberMax(Number(maxVal))

  /**
   * Validate max length of a string or max value of a number
   * @param {Object} options
   * @param {*} options.data - the data to validate
   * @param {String} [options.field] - the name of the field being validated
   * @param {Object} [options.flags={}]
   * @return {Number|String} data
   * @throws {Object} error
   */
  return ({data, field, flags = {}}) => {
    if (utils.isNumber(data)) {
      return checkNumMax({data, field, flags})
    }
    return checkStrMax({data, field, flags})
  }
}

/**
 * Validate email address
 * @param {Object} options
 * @param {*} options.data - the data to validate
 * @param {String} [options.field] - the name of the field being validated
 * @param {Object} [options.flags={}]
 * @return {String} data
 * @throws {Object} error
 */
const email = ({data, field, flags = {}}) => {
  if (isOptional(flags)(data) || W3C_HTML5_EMAIL_REGEX.test(data)) {
    return data
  }

  const msg = field ? `"${data}" is not a valid email address` : `field is not a valid email address`
  throw new Error(msg)
}

/**
 * Trim leading and trailing spaces from a string
 * @param {Object} options
 * @param {*} options.data 
 * @return {*}
 */
const trim = ({data}) => (utils.isString(data) ? data.trim() : data)

/**
 * Create function for validating allowed values
 * @param {Array} vals
 * @return {Function}
 * @throws {Object} error object
 */
const valid = (vals) => {
  if (!Array.isArray(vals)) {
    throw new Error('Argument must be an array')
  }

  /**
   * Validate allowed list of values
   * @param {Object} options
   * @param {*} options.data - the data to validate
   * @param {String} [options.field] - the name of the field being validated
   * @param {Object} [options.flags={}]
   * @return {*} data
   * @throws {Error}
   */
  return ({data, field, flags = {}}) => {
    if (isOptional(flags)(data) || vals.includes(data)) {
      return data
    }

    const msg = field
      ? `"${field}" must be one of [${vals.join(',')}]` 
      : `field must be one of [${vals.join(',')}]`
    throw new Error(msg)
  }
}

/**
 * Create function for validating disallowed values
 * @param {Array} vals
 * @return {Function}
 * @throws {Object} error object
 */
const invalid = (vals) => {
  if (!Array.isArray(vals)) {
    throw new Error('Argument must be an array')
  }

  /**
   * Validate disallowed list of values
   * @param {Object} options
   * @param {*} options.data - the data to validate
   * @param {String} [options.field] - the name of the field being validated
   * @return {*} data
   * @throws {Error}
   */
  return ({data, field}) => {
    if (!vals.includes(data)) {
      return data
    }

    const msg = field
      ? `"${field}" must not be one of [${vals.join(',')}]` 
      : `field must not be one of [${vals.join(',')}]`

    throw new Error(msg)
  }
}

/**
 * Return defaultVal if actualVal is null/undefined
 * @param {Object} options
 * @param {*} options.data 
 * @return {*}
 */
const getDefault = (defaultVal) => ({data}) => (data || defaultVal)

module.exports = {
  required,
  min,
  max,
  validateAsString,
  validateAsInt,
  validateAsNumber,
  email,
  trim,
  valid,
  invalid,
  getDefault
}