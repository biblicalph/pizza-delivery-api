'use strict'

const path = require('path')
const { debuglog } = require('util')
const fileUtil = require('./file-util')

const debug = debuglog('filedb')
// Database will be stored in the .data directory at the root level
let databaseName

const isObject = obj => typeof obj === 'object'
const getDbFilePath = () => path.join(process.cwd(), databaseName || '.data')
const createCollection = collectionName => fileUtil.createDirectory(path.join(getDbFilePath(), collectionName))

/**
 * Returns function for getting the absoulte path to a given document/file in a collection/directory
 * @param {String} collectionName 
 * @return {Function}
 */
const getDocumentFilePath = collectionName => {
  /**
   * Returns the absolute path to a json file that stores the data for this document
   * @param {String} docId - a unique identifier for the document
   * @ereturn {String}
   */
  return function doGetDocumentFilePath(docId) {
    return path.join(getDbFilePath(), collectionName, `${docId}.json`)
  }
}

/**
 * Create model for a collection
 * @param {String} collectionName 
 * @return {Object}
 */
const createModel = (collectionName) => {
  const getAbsFilePath = getDocumentFilePath(collectionName)
  const db = {}

  /**
   * Save document/file in a collection
   * NB: Each time the method is called, it will attempt to create the collection and fails silently if it exists
   * This ensures we don't have to manually create a directory for the collection
   * @param {Object} options
   * @param {String} options.docId - a unique document identifier
   * @param {Object} options.data - the document details
   * @return {Promise} resolves to the saved document
   */
  db.create = async ({docId, data}) => {
    // Create the directory for the collection if it doesn't exist
    await createCollection(collectionName)

    // Fail if document exists
    await fileUtil.writeFile({ path: getAbsFilePath(docId), data: JSON.stringify(data), mode: 'wx' })

    return { ...data, ...{ _id: docId } }
  }

  /**
   * Retrieve a document from a collection
   * @param {String} docId - name of the collection
   * @return {Promise} the document  if found, else null. The returned document includes the docId as _id if the 
   * document is an object
   */
  db.get = async (docId) => {
    let document = null

    try {
      const fileContents = await fileUtil.readFile(getAbsFilePath(docId))
      const doc = JSON.parse(fileContents)
      document = isObject(doc) ? { ...doc, ...{ _id: docId } } : doc
    } catch (err) {
      debug(err)
    }

    return document
  }

  /**
   * Delete a given document
   * @param {String} docId - unique identifier for the document
   * @return {Promise}
   */
  db.delete = async docId => {
    try {
      await fileUtil.deleteFile(getAbsFilePath(docId))

      return true
    } catch (err) {
      debug(err)
    }

    return false
  }


/**
 * Update a document in a collection
 * @param {Object} options
 * @param {String} options.docId - the document identifier
 * @param {Object} options.data - the update details
 * @return {Promise} the updated document. Includes the docId as _id if the updated document is an object
 */
  db.update = async ({docId, data}) => {
    const document = await db.get(docId)

    if (!document) {
      throw new Error(`Document (${docId}) does not exist`)
    }

    let updateDetails = isObject(data) && isObject(document) ? { ...document, ...data } : data

    await fileUtil.writeFile({ path: getAbsFilePath(docId), data: JSON.stringify(updateDetails), mode: 'r+' })

    return isObject(updateDetails) ? { ...updateDetails, ...{ _id: docId } } : updateDetails
  }

  return db
}

module.exports = {
  createModel,
  getDbFilePath,
  initDb: async (dbName = '.data') => {
    databaseName = dbName
    await fileUtil.createDirectory(getDbFilePath())
  }
}