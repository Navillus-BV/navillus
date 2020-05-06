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
    const { reference, sizes } = data

    return Promise.all(sizes.map((size) => saveSize({ reference, size }))).then(
      () => data
    )
  }
}
