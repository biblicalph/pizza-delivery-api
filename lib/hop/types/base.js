'use strict'

const rules = require('../rules')
const createType = require('./create-type')

const baseTemplate = {
  /**
   * Adds required validation rule
   * NB: It also removes any optional rule
   * @return {Object} this
   */
  required: function () {
    const ind = this.tests.findIndex(test => test.name === 'optional')

    if (ind >= 0) {
      this.tests.splice(ind, 1)
    }

    this.tests.push({name: 'required', cb: rules.required})
    return this
  },
  default: function (val) {
    this.tests.unshift({name: 'default', cb: rules.getDefault(val)})
    return this
  },
  allowed: function (values) {
    this.tests.push({name: 'allowed', cb: rules.valid(values)})
    return this
  },
  disallowed: function (values) {
    this.tests.push({name: 'disallowed', cb: rules.invalid(values)})
    return this
  },
  /**
   * Validate the data
   * @param {*} data - the data to validate
   * @param {String} [field] - the name of the field being validated
   * @return {Object} output
   * @return {*} output.original - the original data
   * @return {*} output.data - the validated data
   * @return {String} [output.field] - the field name
   * @throws {Error} on validation error
   */
  validate: function (data, field) {
    const validatedData = this.tests.reduce((dataToValidate, test) => {
      return test.cb(dataToValidate, field)
    }, data)

    return {original: data, data: validatedData, field}
  }
}
const baseProps = {
  isHop: {
    value: true
  },
  tests: [],
  type: {
    value: 'base'
  }
}

exports = module.exports = () => {
  return createType(baseTemplate, baseProps)
}
exports.template = baseTemplate
exports.props = baseProps