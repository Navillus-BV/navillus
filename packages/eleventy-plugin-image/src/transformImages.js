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
  const prepareNewElement = require('./prepareNewElement')(config)

  function isHtml(outputPath) {
    return outputPath && path.extname(outputPath) === '.html'
  }

  function processImage(document) {
    return async function(imgElem) {
      return consumeOriginal({ imgElem, document })
        .then(prepareReferenceImage)
        .then(prepareSizes)
        .then(saveReferenceImage)
        .then(saveSizes)
        .then(prepareNewElement)
        .then(replaceElement)
    }
  }

  async function replaceElement({ imgElem, newElem }) {
    imgElem.parentNode.replaceChild(newElem, imgElem)
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

    const imageProcessor = processImage(dom.window.document)

    await Promise.all(images.map(imageProcessor))

    dom.window.document.head.insertAdjacentHTML(
      'beforeend',
      `<style>
              .blur-up {
                transition: opacity 400ms;
                opacity: 0;
              }
              .blur-up.lazyloaded {
                opacity: 1;
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
