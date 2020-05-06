const { merge } = require('ramda')
const processImages = require('./src/transformImages')

const defaultConfig = {
  input: 'assets', // root directory for original images
  output: 'dist', // root directory for processed images

  // Case insensitive. Only files whose extension exist in this array will be
  // processed by the <img> tag (assuming `optimizeAll` above is true). Empty
  // the array to allow all extensions to be processed. However, only jpegs and
  // pngs are explicitly supported.
  include: ['img/*.+(jpg|jpeg|png)'],

  inlineBelow: 10000, // inline all images in img tag below 10kb

  compressionLevel: 8, // png quality level
  quality: 70, // jpeg/webp quality level

  sizes: [400, 800, 1200], // array of sizes for srcset in pixels

  // WebP options [sharp docs](https://sharp.pixelplumbing.com/en/stable/api-output/#webp)
  webpOptions: { quality: 75, lossless: false, force: true },
  webp: true,

  // source for lazysizes.min.js
  scriptSrc: 'https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js',
}

function plugin(eleventyConfig, pluginOptions = {}) {
  const config = merge(defaultConfig, pluginOptions)

  eleventyConfig.addTransform('images', processImages(config))
}

module.exports = plugin
