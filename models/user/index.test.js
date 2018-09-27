'use strict'

const assert = require('assert')
const path = require('path')
const { initDb, getDbFilePath } = require('../../lib/db')
const fileUtil = require('../../lib/db/file-util')
const { beforeAll, beforeEach, afterAll, afterEach, test, assertThrowsAsync } = require('../../lib/aladdin')
const { roles } = require('./roles')
const userModel = require('./')

const collectionName = 'users'

let userDetails

const generateIdFromEmail = email => email.replace(/[\@\.]/g, '')
const userFields = ['email', 'name', 'address']

beforeAll(async () => {
  await fileUtil.removeDirectory(getDbFilePath())
  await initDb()
})

afterAll(async () => {
  await fileUtil.removeDirectory(getDbFilePath())
})

beforeEach(() => {
  userDetails = {
    name: 'john doe', 
    email: 'john.doe@mail.com',
    address: 'PMB NK Home'
  }
})

afterEach(async () => {
  await fileUtil.removeDirectory(path.join(getDbFilePath(), collectionName))
})

userFields.forEach(val => {
  test(`should throw error if ${val} is not provided when creating user`, async () => {
    delete userDetails[val]

    assertThrowsAsync(async () => { await userModel.create(userDetails) })
  })
})

test('should create a new user', async () => {
  const user = await userModel.create(userDetails)

  assert.equal(user._id, generateIdFromEmail(userDetails.email))
})

test('should set user\'s role to "non-admin" if not provided', async () => {
  const user = await userModel.create(userDetails)

  assert.equal(user.role, 'non-admin')
})

test('should get an existing user', async () => {
  await userModel.create(userDetails)

  const user = await userModel.get(generateIdFromEmail(userDetails.email))

  Object.entries(userDetails).forEach(([field, val]) => {
    assert.equal(user[field], val)
  })
})

test('should update an existing user', async () => {
  await userModel.create(userDetails)

  const updateDetails = { name: 'Einstein' }
  const userId = generateIdFromEmail(userDetails.email)

  await userModel.update(userId, updateDetails)
  const user = await userModel.get(userId)

  assert.equal(user.name, updateDetails.name)
})

test('should remove a user', async () => {
  await userModel.create(userDetails)

  const userId = generateIdFromEmail(userDetails.email)
  await userModel.remove(userId)
  const user = await userModel.get(userId)

  assert.ok(user === null)
})

test('should get all users', async () => {
  const promises = Array.from({ length: 2 }).map((_, ind) => {
    return userModel.create(Object.assign({}, userDetails, { email: `user-${ind}@mail.com` }))
  })
  const users = await Promise.all(promises)

  const allUsers = await userModel.list()

  assert.equal(allUsers.length, users.length)
  users.map((user, ind) => assert.equal(allUsers[ind]._id, user._id))
})