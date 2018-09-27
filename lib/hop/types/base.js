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
    this.flags.optional = false
    this.tests.push({name: 'required', cb: rules.required})
    return this
  },
  default: function (val) {
    this.tests.unshift({name: 'default', cb: rules.getDefault(val)})
    return this
  },
  allow: function (values) {
    this.tests.push({name: 'allow', cb: rules.valid(values)})
    return this
  },
  disallow: function (values) {
    this.tests.push({name: 'disallow', cb: rules.invalid(values)})
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
      return test.cb({ data: dataToValidate, field, flags: this.flags })
    }, data)

    return {original: data, data: validatedData, field}
  }
}
const baseProps = {
  isHop: {
    value: true
  },
  flags: {
    value: {
      optional: true
    },
    writable: true
  },
  tests: [],
  type: {
    value: 'base'
  }
}

exports = module.exports = () => createType(baseTemplate, baseProps)
exports.template = baseTemplate
exports.props = baseProps