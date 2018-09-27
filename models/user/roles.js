'use strict'

const roles = {
  admin: 'admin',
  nonAdmin: 'non-admin'
}
const rolesList = Object.entries(roles).map(([_, role]) => role)

module.exports = {
  roles,
  getListOfRoles: () => [].concat(rolesList)
}