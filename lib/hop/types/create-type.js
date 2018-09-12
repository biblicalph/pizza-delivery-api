'use strict'

const { isObject } = require('../utils')

const isPropObject = (val) => {
  const propFields = ['writable', 'configurable', 'value', 'enumerable', 'get', 'set']

  return isObject(val) && Object.keys(val).some(key => propFields.includes(key))
}

/**
 * Creates a new object that extends prototypeTemplate and contains the properties defined in properties
 * @param {Object} prototypeTemplate - the prototype template
 * @param {Object} properties - additional properties to assign to the object
 * @return {Object}
 */
module.exports = function createType(prototypeTemplate, properties) {
  let props = {}

  Object.entries(properties).forEach(([name, val]) => {
    props[name] = isPropObject(val) 
      ? val
      : {
        value: val,
        writable: true,
        enumerable: true
      }
  })

  // Deep clone props to prevent leaking nested objects to children
  return Object.create(prototypeTemplate, JSON.parse(JSON.stringify(props)))
}