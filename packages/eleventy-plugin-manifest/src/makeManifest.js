const fs = require('fs')
const path = require('path')

module.exports = async function (config) {
  const { icon, output, ...manifest } = config

  await fs.promises.writeFile(
    path.join(output, 'manifest.webmanifest'),
    JSON.stringify(manifest)
  )

  return `<link rel="manifest" href="/manifest.webmanifest" />`
}
