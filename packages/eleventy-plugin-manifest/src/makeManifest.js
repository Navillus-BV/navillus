const fs = require('fs')
const path = require('path')
const { last } = require('ramda')

module.exports = async function (config) {
  const { icon, output, ...manifest } = config

  await fs.promises.writeFile(
    path.join(output, 'manifest.webmanifest'),
    JSON.stringify(manifest)
  )

  const primary = last(manifest.icons)

  return `
    <link rel="shortcut icon" href="${path.join('/', primary.src)}" type="${primary.type}" />
    <link rel="manifest" href="/manifest.webmanifest" />
  `
}
