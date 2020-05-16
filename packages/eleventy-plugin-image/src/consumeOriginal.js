const path = require('path')
const debug = require('./debug')

module.exports = function (config) {
  const sharp = require('./sharp')(config)

  function toInputPath(p) {
    return path.join(config.input, p)
  }

  return async function (data) {
    const { imgElem } = data
    const inputSrc = toInputPath(imgElem.src)

    const { height, width, size } = await sharp(inputSrc).metadata()

    debug('consumeOriginal: %s, %d x %d (H x W), %d kB', imgElem.src, height, width, size)

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
