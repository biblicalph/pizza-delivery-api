'use strict'

const types = require('./types')
const validate = require('./validate')
const createNewObject = require('./types/create-type')

const createHop = () => {
  const hop = {}

  Object.keys(types).map(type => {
    hop[type] = types[type]
  })

  hop.validate = validate

  return createNewObject(hop)
}

module.exports = createHop()