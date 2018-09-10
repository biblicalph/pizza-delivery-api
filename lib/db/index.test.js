'use strict'

if (!process.env.DB_NAME) {
  process.env.DB_NAME = 'testdb'
}
const assert = require('assert')
const path = require('path')
const fileUtil = require('./file-util')
const { createModel, initDb, getDbFilePath } = require('./')
const { beforeAll, beforeEach, afterAll, afterEach, test, assertThrowsAsync } = require('../aladdin')

const collectionName = 'users'
const userModel = createModel(collectionName)

let userDetails, docId

beforeAll(async () => {
  await fileUtil.removeDirectory(getDbFilePath())
  await initDb()
})

afterAll(async () => {
  await fileUtil.removeDirectory(getDbFilePath())
})

beforeEach(() => {
  userDetails = { name: 'john doe', email: 'john.doe@mail.com' }
  docId = '11111111'
})

afterEach(async () => {
  await fileUtil.removeDirectory(path.join(getDbFilePath(), collectionName))
})

test('should create a new document', async () => {
  const expected = { ...userDetails, ...{ _id: docId } }

  const user = await userModel.create({ docId, data: userDetails })

  assert.deepStrictEqual(user, expected)
})

test('should throw error if document exists', async () => {
  await userModel.create({ docId, data: userDetails })
  
  // Use assert.rejects in Node v10
  await assertThrowsAsync(async () => { await userModel.create({ docId, data: userDetails }) })
})

test('should get an existing document', async () => {
  const expected = { ...userDetails, ...{ _id: docId } }

  await userModel.create({ docId, data: userDetails })

  const user = await userModel.get(docId)

  assert.deepStrictEqual(user, expected)
})

test('should return null if document does not exist', async () => {
  const docId = '98888888'

  const user = await userModel.get(docId)

  assert.ok(user === null)
})

test('should update an existing document', async () => {

})

test('should delete an existing document', async () => {
  await userModel.create({ docId, data: userDetails })

  await userModel.delete(docId)

  const user = await userModel.get(docId)

  assert.ok(user === null)
})