const debug = require('./debug')

module.exports = function (config) {
  const sharp = require('./sharp')(config)

  return async function (data) {
    const { imgElem, original, reference } = data
    const { height, width, fit, position } = reference

    if (reference.inline) {
      debug('saveReferenceImage: skipping %s, it will be inlined', imgElem.src)
      return data
    }

    await sharp(original.src)
      .resize({
        height,
        width,
        fit,
        position,
      })
      .toFile(reference.output)

    debug('saveReferenceImage: %s -> %s', imgElem.src, reference.output)

    return data
  }
}
