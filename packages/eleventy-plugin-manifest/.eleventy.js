const { merge } = require('ramda')
const generateIcons = require('./src/generateIcons')
const makeManifest = require('./src/makeManifest')

const defaultConfig = {
  output: 'dist',
  name: 'Eleventy',
  short_name: 'Eleventy',
  start_url: '/',
  background_color: '#ffffff',
  theme_color: '#222222',
  display: 'standalone',
  icon: 'src/assets/img/uploads/favicon.svg',
  icons: [
    {
      src: `icons/icon-48x48.png`,
      sizes: `48x48`,
      type: `image/png`,
    },
    {
      src: `icons/icon-72x72.png`,
      sizes: `72x72`,
      type: `image/png`,
    },
    {
      src: `icons/icon-96x96.png`,
      sizes: `96x96`,
      type: `image/png`,
    },
    {
      src: `icons/icon-144x144.png`,
      sizes: `144x144`,
      type: `image/png`,
    },
    {
      src: `icons/icon-192x192.png`,
      sizes: `192x192`,
      type: `image/png`,
    },
    {
      src: `icons/icon-256x256.png`,
      sizes: `256x256`,
      type: `image/png`,
    },
    {
      src: `icons/icon-384x384.png`,
      sizes: `384x384`,
      type: `image/png`,
    },
    {
      src: `icons/icon-512x512.png`,
      sizes: `512x512`,
      type: `image/png`,
    },
  ],
}

let pluginPromise

function plugin(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncFilter('manifest', async (value, cb) => {
    const config = merge(defaultConfig, value)

    pluginPromise = pluginPromise || generateIcons(config).then(makeManifest)

    const html = await pluginPromise

    cb(null, html)
  })
}

module.exports = plugin
