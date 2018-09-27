'use strict'

const { createModel } = require('../../lib/db')
const { validate: validateWithHop } = require('../../lib/hop')
const rules = require('./validation-rules')
const { isUndefined } = require('../../lib/hop/utils')

const userCollection = createModel('users')
const userModel = {}

const generateUserIdFromEmail = email => email.replace(/[\@\.]/g, '')
/**
 * Creates function for validating data using hop
 * @param {Object} schema - validation schema
 * @return {Function}
 */
const validate = schema => details => {
  const { error, value } = validateWithHop(details, schema)

  if (error) {
    throw error
  }

  return value
}
/**
 * Returns new object with all fields with undefined values removed
 * @param {Object} obj 
 */
const removeUndefinedPropsFromObj = obj => {
  const newObj = {}

  Object.entries(obj).forEach(([key, val]) => {
    if (!isUndefined(val)) {
      newObj[key] = val
    }
  })

  return newObj
}

/**
 * Create a new user
 * @param {Object} userDetails - details of the user. It should include an _id field
 * @return {Promise} resolves to the created user
 * @throws {Error} 
 */
userModel.create = (userDetails) => {
  const newUserDetails = validate(rules.create)(userDetails)
  
  return userCollection.create({ docId: generateUserIdFromEmail(newUserDetails.email), data: newUserDetails })
}

/**
 * Updates the details of an existing user
 * @param {String} userId - the user id
 * @param {Object} updateDetails - the user's details
 * @return {Promise} resolves to the updated user
 * @throws {Error}
 */
userModel.update = (userId, updateDetails) => {
  const newUpdateDetails = removeUndefinedPropsFromObj(validate(rules.update)(updateDetails))
  return userCollection.update({ docId: userId, data: newUpdateDetails })
}

/**
 * Get the user with the given id
 * @param {String} userId - the user id
 * @return {Promise} resolves to the user or null
 * @throws {Error}
 */
userModel.get = (userId) => {
  return userCollection.get(userId)
}

/**
 * Remove the user with the given id
 * @param {String} userId - user id
 * @return {Promise} resolves to true if the user was deleted, false otherwise
 * @throws {Error}
 */
userModel.remove = (userId) => {
  return userCollection.delete(userId)
}

/**
 * Returns the list of all users
 * @return {Promise} resolves to an array of users
 */
userModel.list = () => {
  return userCollection.getAll()
}

module.exports = Object.create(userModel)