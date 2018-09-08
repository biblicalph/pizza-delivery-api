'use strict'

const fs = require('fs')
const path = require('path')

/**
 * Determine if a file is a test file or not (ends with either .spec.js or .test.js)
 * @param {String} filename - name of a file
 * @return {boolean}
 */
const isTestFile = filename => filename.endsWith('.spec.js') || filename.endsWith('.test.js')
/**
 * Determine if the given file path is a directory
 * @param {String} path - the directory path
 * @return {boolean}
 */
const isDirectory = path => {
  const stats = fs.lstatSync(path)

  return stats.isDirectory()
}
/**
 * Loads all test files in the project directory by recursing into sub directories
 * @param {String} dir - directory path
 * @return {Array<String>} list of absolute file paths
 */
const loadTestFiles = (dir) => {
  const testFiles = []
  
  try {
    const files = fs.readdirSync(dir)

    files
      .filter(isTestFile)
      .forEach(filename => testFiles.push(path.join(dir, filename)))

    files
      .filter(filename => isDirectory(path.join(dir, filename)))
      .forEach(subDir => testFiles.push(...loadTestFiles(path.join(dir, subDir))))
  } catch (err) {
    console.error(err)
  }

  return testFiles
}

module.exports = loadTestFiles