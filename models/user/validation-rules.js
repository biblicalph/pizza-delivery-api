'use strict'

const hop = require('../../lib/hop')
const { getListOfRoles, roles } = require('./roles')

module.exports = {
  create: {
    email: hop.string().email().required(),
    name: hop.string().required(),
    address: hop.string().required(),
    role: hop.string().allow(getListOfRoles()).default(roles.nonAdmin).required()
  },
  update: {
    email: hop.string().email(),
    name: hop.string(),
    address: hop.string(),
    role: hop.string().allow(getListOfRoles())
  }
}