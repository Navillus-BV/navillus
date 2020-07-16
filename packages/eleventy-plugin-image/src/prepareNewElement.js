const debug = require('./debug')

module.exports = function (config) {
  const sharp = require('./sharp')(config)

  return async function (data) {
    const { imgElem, reference, sizes, document } = data

    const getBase64 = async (size) => {
      const buffer = await sharp(reference.output).resize(size).toBuffer()

      return `data:image/png;base64,${buffer.toString('base64')}`
    }

    const newElem = document.createElement('div')
    newElem.style.position = 'relative'
    newElem.style.overflow = 'hidden'
    newElem.style.width = '100%'

    newElem.innerHTML = `
      <div style="width: 100%; padding-bottom: ${
        100.0 / reference.aspectRatio
      }%;"></div>
      <img src="${await getBase64(
        64
      )}" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; object-fit: cover; object-position: center center;" alt="${
      imgElem.alt
    }">
      <picture>
        <source srcset="${sizes
          .map(({ src, width }) => `${src} ${width}w`)
          .join(', ')}">
        <img class="lazyload blur-up" src="${reference.src}" alt="${
      imgElem.alt
    }" title="${
      imgElem.alt
    }" loading="lazy" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; object-fit: cover; object-position: center center;">
      </picture>
    `

    return {
      ...data,
      newElem,
    }
  }
}
