const fs = require('fs')
const path = require('path')
const debug = require('./debug')

async function getFileSize(filename) {
  const stats = await fs.promises.stat(path.join(process.cwd(), filename))
  return stats.size
}

module.exports = function (config) {
  const sharp = require('./sharp')(config)

  function toInputPath(p) {
    return path.join(config.input, p)
  }

  return async function (data) {
    const { imgElem } = data
    const inputSrc = toInputPath(imgElem.src)

    const [metadata, size] = await Promise.all([
      sharp(inputSrc).metadata(),
      getFileSize(inputSrc),
    ])
    const { height, width } = metadata

    debug(
      'consumeOriginal: %s, %d x %d (H x W), %d kB',
      imgElem.src,
      height,
      width,
      size
    )

    return {
      original: {
        src: inputSrc,
        aspectRatio: width / height,
        height,
        width,
        size,
      },
      ...data,
    }
  }
}
