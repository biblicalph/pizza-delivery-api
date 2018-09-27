'use strict'

const fs = require('fs')
const { debuglog, promisify } = require('util')
const path = require('path')
const fileUtil = {}

const debug = debuglog('fileutil')
const readDirPromise = promisify(fs.readdir)
const lstatPromise = promisify(fs.lstat)
const rmDirPromise = promisify(fs.rmdir)

/**
 * Get the list of files in a directory
 * @param {String} dirPath - the directory path
 * @return {Promise} resolves to an array of objects each of which includes the filename, 
 * basename (filename with extension) and filepath (full file path)
 */
const getFilesInDir = async dirPath => {
  const filesInDir = await readDirPromise(dirPath)

  return filesInDir.map(filename => {
    return { 
      filename, 
      basename: path.basename(filename, path.extname(filename)), 
      filepath: path.join(dirPath, filename) 
    }
  })
}

/**
 * Create directory
 * Note: If the directory already exists, an error is thrown but we'll suppress it
 * @param {String} dirPath - the directory path
 * @return {Promise}
 */
fileUtil.createDirectory = dirPath => promisify(fs.mkdir)(dirPath).catch(debug)

/**
 * Removes directory and everything it contains
 * NB: No errors are thrown if the directory does not exist
 * @param {String} dirPath - the directory path
 * @return {Promise}
 */
fileUtil.removeDirectory = async dirPath => {
  try {
    const filesInDir = await getFilesInDir(dirPath)
    
    await Promise.all(
      filesInDir
        .map(async ({filepath}) => {
          const stats = await lstatPromise(filepath)
          
          return stats.isDirectory() ? fileUtil.removeDirectory(filepath) : fileUtil.deleteFile(filepath)
        })
    )
  
    await rmDirPromise(dirPath)
  } catch (err) {
    debug(err)
  }
}

/**
 * Open a file for reading, writing or both
 * @param {Object} options
 * @param {String} options.path - the file path
 * @param {String} [options.mode = 'r'] - the file system flag
 * @return {Promise} 
 */
fileUtil.openFile = ({ path, mode = 'r' }) => promisify(fs.open)(path, mode)

/**
 * Close an open file
 * @param {Object} fd - the file descriptor
 * @return {Promise} 
 */
fileUtil.closeFile = fd => promisify(fs.close)(fd)

/**
 * Write to a file. The data is stored as a JSON string
 * @param {Object} options
 * @param {String} options.path - the file path
 * @param {Object} options.data - the data to write to the filesystem
 * @param {String} [options.mode = 'w'] - open file in write mode 
 * @return {Function} 
 */
fileUtil.writeFile = ({ path, data, mode = 'w' }) => promisify(fs.writeFile)(path, data, { flag: mode })

/**
 * Read a file
 * @param {Object} options
 * @param {String} options.path - the file path
 * @return {Promise} 
 */
fileUtil.readFile = (path) => promisify(fs.readFile)(path)

/**
 * Open a file for reading, writing or both
 * @param {String} path - the path to the file to delete
 * @return {Promise} 
 */
fileUtil.deleteFile = path => promisify(fs.unlink)(path)

/**
 * Read files in a given directory. The read operation is not recursive
 * @param {String} dirPath - the full path to the directory
 * @return {Promise} resolves to an array of objects each of which has a filename, 
 * basename (filename without extension) and filepath
 */
fileUtil.readDirectory = getFilesInDir

module.exports = Object.create(fileUtil)

