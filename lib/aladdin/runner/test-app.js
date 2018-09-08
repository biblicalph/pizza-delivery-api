'use strict'

/**
 * Create the test app
 * @return {Object} testApp
 * @return {Object} testApp.stack - the stack of before and after hooks
 * @return {Array<Function>} testApp.stack.before - stack of before all and each hooks
 * @return {Array<Function>} testApp.stack.after - stack of after all and each hooks
 * @return {Array<Object>} testApp.tests - stack of test objects. Each entry is an object consisting of the title and 
 * callback function
 */
const createTestApp = () => {
  const app = {
    beforeAll: [],
    afterAll: [],
    beforeEach: [],
    afterEach: [],
    tests: []
  }

  return {
    /**
     * Queue a test for later execution
     * @param {Object} options
     * @param {String} options.title - the test title or description
     * @param {Function} options.cb - the callback function
     * @returns {Number} the new length of the tests stack
     */
    queueTest: ({ title, cb }) => app.tests.push({ title, cb }),
    /**
     * Pop the first test in the queue and return it
     * @return {Object} a queued test
     */
    popTest: () => app.tests.shift(),
    /**
     * Returns a copy of all the queued tests
     * @return {Array<Object>}
     */
    getTests: () => [].concat(app.tests),
    /**
     * Returns the total number of queued tests
     * @return {Number}
     */
    getNumTests: () => app.tests.length,
    /**
     * Queues a before all hook
     * @param {Function} cb - the callback function
     * @returns {Number} the new length of the before all hooks stack
     */
    queueBeforeAllHook: cb => app.beforeAll.push(cb),
    /**
     * Queues a before each hook
     * @param {Function} cb - the callback function
     * @returns {Number} the new length of the before each hooks stack
     */
    queueBeforeEachHook: cb => app.beforeEach.push(cb),
    /**
     * Queues an after all hook
     * @param {Function} cb - the callback function
     * @returns {Number} the new length of the after all hooks stack
     */
    queueAfterAllHook: cb => app.afterAll.push(cb),
    /**
     * Queues an after each hook
     * @param {Function} cb - the callback function
     * @returns {Number} the new length of the after each hooks stack
     */
    queueAfterEachHook: cb => app.afterEach.push(cb),
    /**
     * Returns the list of before all hooks
     * @return {Array<Object>}
     */
    getBeforeAllHooks: () => [].concat(app.beforeAll),
    /**
     * Returns the list of before each hooks
     * @return {Array<Object>}
     */
    getBeforeEachHooks: () => [].concat(app.beforeEach),
    /**
     * Returns the list of after all hooks
     * @return {Array<Object>}
     */
    getAfterAllHooks: () => [].concat(app.afterAll),
    /**
     * Returns the list of after each hooks
     * @return {Array<Object>}
     */
    getAfterEachHooks: () => [].concat(app.afterEach),
    /**
     * Reset the before and after hooks
     */
    resetBeforeAfterHooks: () => {
      app.beforeAll = []
      app.afterAll = []
      app.beforeEach = []
      app.afterEach = []
    }
  }
}

module.exports = createTestApp