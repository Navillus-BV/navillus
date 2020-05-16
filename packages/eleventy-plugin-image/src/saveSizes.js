const debug = require('./debug')

module.exports = function (config) {
  const sharp = require('./sharp')(config)

  async function saveSize({ reference, size }) {
    const { output, width } = size

    return await sharp(reference.output)
      .resize({
        width,
      })
      .toFile(output)
  }

  return function (data) {
    const { imgElem, reference, sizes } = data

    debug('saveSizes: %s saving %o', imgElem.src, sizes)

    return Promise.all(sizes.map((size) => saveSize({ reference, size }))).then(
      () => data
    )
  }
}
