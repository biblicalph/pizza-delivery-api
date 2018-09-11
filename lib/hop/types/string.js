'use strict'

const rules = require('../rules')
const baseType = require('./base')

const stringType = () => {
  const baseObj = baseType()
  baseObj.tests.push({name: 'string', cb: rules.validateAsString})

  return {
    ...baseObj,
    ...{
      type: 'string',
      min: function (minVal) {
        this.tests.push({name: 'min', cb: rules.min(minVal)})
        return this
      },
      max: function (maxVal) {
        this.tests.push({name: 'max', cb: rules.max(maxVal)})
        return this
      },
      email: function () {
        this.tests.push({name: 'email', cb: rules.email})
        return this
      },
      trim: function () {
        this.tests.unshift({name: 'trim', cb: rules.trim})
        return this
      }
    }
  }
}

module.exports = stringType