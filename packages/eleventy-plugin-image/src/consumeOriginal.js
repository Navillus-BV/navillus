const path = require('path')

module.exports = function (config) {
  const sharp = require('./sharp')(config)

  function toInputPath(p) {
    return path.join(config.input, p)
  }

  return async function (data) {
    const { imgElem } = data
    const inputSrc = toInputPath(imgElem.src)

    const { height, width } = await sharp(inputSrc).metadata()

    return {
      original: {
        src: inputSrc,
        aspectRatio: width / height,
        height,
        width,
      },
      ...data,
    }
  }
}
