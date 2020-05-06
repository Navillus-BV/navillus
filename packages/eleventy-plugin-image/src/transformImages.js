const { JSDOM } = require('jsdom')
const path = require('path')
const debug = require('./debug')

module.exports = function (config) {
  const consumeOriginal = require('./consumeOriginal')(config)
  const isSupportedSrc = require('./isSupportedSrc')(config)
  const prepareReferenceImage = require('./prepareReference')(config)
  const prepareSizes = require('./prepareSizes')(config)
  const saveReferenceImage = require('./saveReferenceImage')(config)
  const saveSizes = require('./saveSizes')(config)
  const updateImgElem = require('./updateImgElem')(config)

  function isHtml(outputPath) {
    return outputPath && path.extname(outputPath) === '.html'
  }

  async function processImage(imgElem) {
    return consumeOriginal({ imgElem })
      .then(prepareReferenceImage)
      .then(prepareSizes)
      .then(saveReferenceImage)
      .then(saveSizes)
      .then(updateImgElem)
  }

  return async function (rawContent, outputPath) {
    if (!isHtml(outputPath)) {
      return rawContent
    }

    const dom = new JSDOM(rawContent)

    const images = Array.from(
      dom.window.document.querySelectorAll('img')
    ).filter(isSupportedSrc)

    debug(outputPath, `found ${images.length} supported images`)

    await Promise.all(images.map(processImage))

    dom.window.document.head.insertAdjacentHTML(
      'beforeend',
      `<style>
              .blur-up {
                -webkit-filter: blur(10px);
                filter: blur(10px);
                transition: filter 400ms, -webkit-filter 400ms;
              }
              .blur-up.lazyloaded {
                -webkit-filter: blur(0);
                filter: blur(0);
              }
              img[data-sizes="auto"] {
                display: block;
                width: 100%;
              }
            </style>`
    )

    dom.window.document.body.insertAdjacentHTML(
      'beforeend',
      `<script src="${config.scriptSrc}" async></script>`
    )

    return dom.serialize()
  }
}
