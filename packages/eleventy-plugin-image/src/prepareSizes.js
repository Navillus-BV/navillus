const path = require('path')
const { append, filter, map, pipe, sort, subtract, uniq } = require('ramda')

module.exports = function (config) {
  return async function (data) {
    const { reference, original } = data

    const srcWithSize = (src, size) => {
      const ext = path.extname(src)
      return src.replace(ext, `-${size}${ext}`)
    }

    const isValidSize = (s) => s <= original.width

    const getSizes = pipe(
      append(original.width),
      filter(isValidSize),
      sort(subtract),
      uniq
    )

    const getSizeData = (width) => ({
      src: srcWithSize(reference.src, width),
      output: srcWithSize(reference.output, width),
      width,
    })

    const sizesPipeline = pipe(getSizes, map(getSizeData))

    const sizes = reference.inline ? [] : sizesPipeline(config.sizes)

    return {
      ...data,
      sizes,
    }
  }
}
