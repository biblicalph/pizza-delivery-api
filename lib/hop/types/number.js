'use strict'

const rules = require('../rules')
const baseType = require('./base')

const numberType = () => {
  const baseObj = baseType()
  baseObj.tests.push({name: 'number', cb: rules.validateAsNumber})

  return {
    ...baseObj,
    ...{
      type: 'number',
      min: function (minVal) {
        this.tests.push({name: 'min', cb: rules.min(minVal)})
        return this
      },
      max: function (maxVal) {
        this.tests.push({name: 'max', cb: rules.max(maxVal)})
        return this
      },
      integer: function () {
        this.tests.push({name: 'integer', cb: rules.validateAsInt})
        return this
      },
      int: function () {
        return this.integer()
      }
    }
  }
}

module.exports = numberType