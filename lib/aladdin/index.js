const createSuite = require('./suite')
const { testApp, runAppTests } = require('./runner')

module.exports = createSuite(testApp)

// Load and run tests if executing from command line
if (!module.parent) {
  runAppTests()
}