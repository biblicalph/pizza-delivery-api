'use strict'

const isString = data => typeof data === 'string'

const isObject = data => typeof data === 'object'

const isArray = data => isObject(data) && Array.isArray(data)

const isNumber = data => {
  if (isEmpty(isString(data) ? data.trim() : data)) {
    return false
  }
  
  const parsed = Number(data)

  return typeof parsed === 'number' && !isNaN(parsed)
}

const isFloat = data => isNumber(data) && (Number(data) === parseFloat(data))

const isInteger = data => isNumber(data) && (Number(data) === parseInt(data, 10))

const isUndefined = data => typeof data === 'undefined'

const isNull = data => (isObject(data) && data === null)

const isEmpty = data => (isUndefined(data) || isNull(data) || (isString(data) && data === ''))

module.exports = {
  isString,
  isObject,
  isNumber,
  isFloat,
  isInteger,
  isArray,
  isUndefined,
  isNull,
  isEmpty
}