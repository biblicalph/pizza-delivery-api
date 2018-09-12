'use strict'

const process = require('process')
const path = require('path')
const createRunnable = require('./runnable')
const loadTestFiles = require('./loader')
const createTestApp = require('./test-app')

const testApp = createTestApp()

/**
 * Load test files and run the tests
 * @param {Object} testApp - the test app
 */
function loadAndRunTests(testApp) {
  const runTests = createRunnable(testApp)

  const testFiles = []
  return async function doRunTests() {
    if (!testFiles.length) {
      testFiles.push(...loadTestFiles(process.cwd()))
    }

    for (let i = 0; i < testFiles.length; ++i) {
      // Clean up before and after hooks after executing a file's tests
      const filename = path.basename(testFiles[i]).replace(/\.(spec|test)\.js/, '').toLocaleUpperCase()
      console.log('\n============ %s TESTS ============', filename)
      try {
        require(testFiles[i])

        await runTests(testApp)
      } catch (err) {
        console.error(err)
      } 
      testApp.resetBeforeAfterHooks()
    }
  }
}

module.exports = Object.create({
  testApp,
  runAppTests: loadAndRunTests(testApp)
})