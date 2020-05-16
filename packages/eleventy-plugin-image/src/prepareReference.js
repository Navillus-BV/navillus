const path = require('path')
const { defaultTo, pipe } = require('ramda')

module.exports = function (config) {
  return function (data) {
    const { imgElem, original } = data

    const defaultToUndefined = defaultTo(undefined)
    const intOrUndefined = pipe(parseInt, defaultToUndefined)

    const srcWithRatio = (src, height, width) => {
      const ext = path.extname(src)
      return src.replace(ext, `_${width}x${height}${ext}`)
    }

    const reference = {
      src: imgElem.src,
      height: intOrUndefined(imgElem.dataset.aspectHeight),
      width: intOrUndefined(imgElem.dataset.aspectWidth),
      inline: original.size < config.inlineBelow,
      fit: imgElem.dataset.aspectFit,
      position: imgElem.dataset.aspectPosition,
      aspectRatio: original.aspectRatio,
    }

    if (reference.height && reference.width) {
      reference.src = srcWithRatio(
        reference.src,
        reference.height,
        reference.width
      )
      reference.aspectRatio = reference.width / reference.height

      const useHeight = reference.aspectRatio < original.aspectRatio

      reference.height = useHeight
        ? original.height
        : Math.round(original.width / reference.aspectRatio)
      reference.width = useHeight
        ? Math.round(original.height * reference.aspectRatio)
        : original.width
    } else {
      reference.height = original.height
      reference.width = original.width
      reference.aspectRatio = original.aspectRatio
    }

    reference.output = path.join(config.output, reference.src)

    return {
      ...data,
      reference,
    }
  }
}
