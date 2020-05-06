const glob = require('glob')
const path = require('path')

module.exports = function (config) {
  function fromInputPath(p) {
    return p.replace(`${config.input}`, '')
  }

  function toInputPath(p) {
    return path.join(config.input, p)
  }

  const supportedFiles = config.include
    .map(toInputPath)
    .map((pattern) => glob.sync(pattern))
    .reduce((acc, next) => acc.concat(next), [])
    .map(fromInputPath)
    .reduce((acc, next) => acc.add(next), new Set())

  return function ({ src }) {
    return supportedFiles.has(src)
  }
}
