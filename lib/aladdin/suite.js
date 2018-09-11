'use strict'

const assert = require('assert')

/**
 * Create function for registering tests
 * @param {Object} app - the test app
 * @return {Function}
 */
const createTest = app => {
  /**
   * Queue a test
   * @param {String} title 
   * @param {Function} cb 
   */
  return async (title, cb) => app.queueTest({ title, cb })
} 

/**
 * Creates function for registering before all hooks
 * @param {Object} app - the test app 
 * @return {Function}
 */
const createBeforeAllHook = app => {
  /**
   * Queue a before all callback
   * @param {Function} cb 
   */
  return cb => app.queueBeforeAllHook(cb)
}

/**
 * Creates function for registering before each hooks
 * @param {Object} app - the test app 
 * @return {Function}
 */
const createBeforeEachHook = app => {
  /**
   * Queue a before each callback
   * @param {Function} cb 
   */
  return cb => app.queueBeforeEachHook(cb)
}

/**
 * Creates function for registering after all hooks
 * @param {Object} app 
 * @return {Function}
 */
const createAfterAllHook = app => {
  /**
   * Queue an after all callback
   * @param {Function} cb 
   */
  return cb => app.queueAfterAllHook(cb)
}

/**
 * Creates function for registering after each hooks
 * @param {Object} app 
 * @return {Function}
 */
const createAfterEachHook = app => {
  /**
   * Queue an after each callback
   * @param {Function} cb 
   */
  return cb => app.queueAfterEachHook(cb)
}

/**
 * 
 * @param {Object} app - the test app instance
 * @return {Object} suite
 * @return {Function} suite.beforeAll
 * @return {Function} suite.beforeEach
 * @return {Function} suite.afterAll
 * @return {Function} suite.afterEach
 * @return {Function} suite.test
 */
module.exports = function createTestSuite(app) {
  return {
    beforeAll: createBeforeAllHook(app),
    afterAll: createAfterAllHook(app),
    beforeEach: createBeforeEachHook(app),
    afterEach: createAfterEachHook(app),
    test: createTest(app),
    /**
     * Assertion `throws` helper for async functions
     * @param {Function} cb - the async callback
     * @param {String|Error} error - regex or error object
     */
    assertThrowsAsync: async (cb, error = /Error/) => {
      let fn = () => {}

      try {
        await cb()
      } catch (err) {
        fn = () => { throw err }
      } finally {
        assert.throws(fn, error)
      }
    }
  }
}