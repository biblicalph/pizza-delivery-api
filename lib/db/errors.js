'use strict'

const { customError } = require('../error')

module.exports = {
  conflictWithExistingDocumentError: (docId) => {
    return customError({
      name: 'ConflictWithExistingDocumentError',
      message: `Document (${docId}) exists`
    })
  },
  documentNotFoundError: (docId) => {
    return customError({
      name: 'DocumentNotFoundError',
      message: `Document (${docId}) does not exist`
    })
  }
}