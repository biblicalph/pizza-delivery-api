'use strict'

const RESET_TERMINAL = '\x1b[0m'
const COLOR_GREEN = '\x1b[32m'
const COLOR_RED = '\x1b[31m'

/**
 * Create function for executing queued before all hooks
 * @param {Object} app 
 * @return {Function}
 */
const createBeforeAllHooksRunner = app => {
  /**
   * Run before all callbacks in FIFO (first in, first out) order
   */
  return async () => {
    const beforeAllHooks = app.getBeforeAllHooks()

    for (let i = 0; i < beforeAllHooks.length; ++i) {
      await beforeAllHooks[i]()
    }
  }
}
/**
 * Create function for executing queued before each hooks
 * @param {Object} app 
 * @return {Function}
 */
const createBeforeEachHooksRunner = app => {
  /**
   * Run before each callbacks in FIFO (first in, first out) order
   */
  return async () => {
    const beforeEachHooks = app.getBeforeEachHooks()

    for (let i = 0; i < beforeEachHooks.length; ++i) {
      await beforeEachHooks[i]()
    }
  }
}
/**
 * Create function for executing queued after all hooks
 * @param {Object} app
 * @return {Function}
 */
const createAfterAllHooksRunner = app => {
  /**
   * Run after all callbacks in LIFO (last in, first out) order 
   */
  return async () => {
    const afterAllHooks = app.getAfterAllHooks()
    
    for (let i = afterAllHooks.length - 1; i >= 0; --i) {
      await afterAllHooks[i]()
    }
  }
}
/**
 * Create function for executing queued after each hooks
 * @param {Object} app
 * @return {Function}
 */
const createAfterEachHooksRunner = app => {
  /**
   * Run after each callbacks in LIFO (last in, first out) order 
   */
  return async () => {
    const afterEachHooks = app.getAfterEachHooks()
    
    for (let i = afterEachHooks.length - 1; i >= 0; --i) {
      await afterEachHooks[i]()
    }
  }
}
/**
 * Creates a function for logging to the console
 * @param {String} color - the text color in the terminal
 * @return {Function}
 */
const createLogger = color => title => console.log(`${color}%s${RESET_TERMINAL}`, title)
/**
 * Logs a test success message to the console
 * @param {String} title - the title/description/label of the test to log
 */
const logSuccess = title => {
  const log = createLogger(COLOR_GREEN)
  log(`✓ ${title}`)
}
/**
 * Returns a function for logging failed tests to the console
 * @param {String} title - the title/description/label of the test to log
 * @return {Function}
 */
const logFailure = title => {
  const log = createLogger(COLOR_RED)

  /**
   * Logs a test error to the console 
   * @param {Object} err - the error object
   */
  return err => {
    log(`x ${title}`)
    console.error(err)
  }
}
/**
 * Create function for running a single test
 * @param {Object} app - the test app
 * @return {Function}
 */
const createRunner = app => {
  const runBeforeEachCallbacks = createBeforeEachHooksRunner(app)
  const runAfterEachCallbacks = createAfterEachHooksRunner(app)

  /**
   * Run a queued test
   * @param {Object} options
   * @param {String} options.title - the title/description of the test
   * @param {Function} options.cb - the callback function 
   */
  return async ({title, cb}) => {
    const logFailedTest = logFailure(title)
  
    try {
      await runBeforeEachCallbacks()
      await cb()
  
      logSuccess(title)
    } catch (err) {
      logFailedTest(err)
    } 
    await runAfterEachCallbacks()
  }
}
/**
 * Creates function for running queued tests
 * @param {Object} app - the test app
 * @return {Function}
 */
const createTestsRunner = app => {
  const runTest = createRunner(app)
  const runBeforeAllHooks = createBeforeAllHooksRunner(app)
  const runAfterAllHooks = createAfterAllHooksRunner(app)

  /**
   * Pop queued tests off the stack and execute them
   * NB: Before all and after all hooks are run once per test file. Before and after each hooks on the other hand 
   * are run per test
   */
  return async () => {
    await runBeforeAllHooks()

    const numTests = app.getNumTests()
    for (let i = 0; i < numTests; ++i) {
      await runTest(app.popTest())
    }

    await runAfterAllHooks()
  }
} 

module.exports = createTestsRunner