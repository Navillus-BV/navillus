const debug = require('./debug')

module.exports = function (config) {
  const sharp = require('./sharp')(config)

  async function saveSize({ original, reference, size }) {
    const { fit, height, output, position, width } = size

    return await sharp(original.src)
      .resize({
        width,
        height,
        fit,
        position
      })
      .toFile(output)
  }

  return function (data) {
    const { imgElem, original, reference, sizes } = data

    debug('saveSizes: %s saving %o', imgElem.src, sizes)

    return Promise.all(sizes.map((size) => saveSize({ original, reference, size }))).then(
      () => data
    )
  }
}
