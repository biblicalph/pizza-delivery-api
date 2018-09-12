'use strict'

const types = require('./types')

const hop = {}
Object.keys(types).map(type => {
  hop[type] = types[type]
})

module.exports = hop