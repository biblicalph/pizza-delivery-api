'use strict'

const rules = require('../rules')
const { template: baseTemplate, props: baseProps } = require('./base')
const createType = require('./create-type')

const numberTemplate = {
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
    integer: function () {
      this.tests.push({name: 'integer', cb: rules.validateAsInt})
      return this
    },
    int: function () {
      return this.integer()
    }
  }
}
const numberProps = {
  ...baseProps,
  ...{
    type: {
      value: 'number'
    }
  }
}

exports = module.exports = () => {
  const obj = createType(numberTemplate, numberProps)

  // should validate data as a number
  obj.tests.push({name: 'number', cb: rules.validateAsNumber})

  return obj
}
exports.template = numberTemplate
exports.props = numberProps