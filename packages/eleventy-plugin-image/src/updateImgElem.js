const debug = require('./debug')

module.exports = function (config) {
  const sharp = require('./sharp')(config)

  return async function (data) {
    const { imgElem, reference, sizes } = data

    const getBase64 = async (size) => {
      const buffer = await sharp(reference.output).resize(size).toBuffer()

      return `data:image/png;base64,${buffer.toString('base64')}`
    }

    imgElem.removeAttribute('data-aspect-height')
    imgElem.removeAttribute('data-aspect-width')
    imgElem.removeAttribute('data-aspect-fit')
    imgElem.removeAttribute('data-aspect-position')

    if (reference.inline) {
      imgElem.src = await getBase64(reference.width)
    } else {
      imgElem.src = reference.src
      imgElem.setAttribute(
        'data-srcset',
        sizes.map(({ src, width }) => `${src} ${width}w`).join(', ')
      )
      imgElem.setAttribute('data-src', 'auto')
      imgElem.setAttribute('srcset', await getBase64(64))

      imgElem.classList.add('lazyload')
      imgElem.classList.add('blur-up')
    }

    return data
  }
}
