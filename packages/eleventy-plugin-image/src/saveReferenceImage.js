module.exports = function (config) {
  const sharp = require('./sharp')(config)

  return async function (data) {
    const { original, reference } = data
    const { height, width, fit, position } = reference

    if (reference.inline) {
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

    return data
  }
}
