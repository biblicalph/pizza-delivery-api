'use strict'

const rules = require('../rules')
const { template: baseTemplate, props: baseProps } = require('./base')
const createType = require('./create-type')

const stringTemplate = {
  ...baseTemplate,
  ...{
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
const stringProps = {
  ...baseProps,
  ...{
    type: {
      value: 'string'
    }
  }
}

exports = module.exports = () => {
  const obj = createType(stringTemplate, stringProps)

  // should validate data as a string
  obj.tests.push({name: 'string', cb: rules.validateAsString})

  return obj
}
exports.template = stringTemplate
exports.props = stringProps