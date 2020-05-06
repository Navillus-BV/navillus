const fs = require('fs')
const fsExtra = require('fs-extra')
const path = require('path')
const sharp = require('sharp')
const debug = require('./debug')

async function ensureExists(dir) {
  try {
    await fs.promises.mkdir(dir)
  } catch (err) {
    if (err && err.code == 'ENOENT') {
      return
    }
    throw err
  }
}

let icons = new Set()

module.exports = async function (config) {
  async function generateIcon(icon) {
    const iconPath = path.join(config.output, icon.src)
    const size = parseInt(icon.sizes.substring(0, icon.sizes.lastIndexOf('x')))
    const density = Math.min(2400, Math.max(1, size))

    if (icons.has(icon.src)) {
      return
    }

    icons.add(icon.src)

    const iconDir = path.dirname(iconPath)
    await fsExtra.ensureDir(iconDir)

    debug(`Writing ${iconPath}`)

    await sharp(config.icon, { density })
      .resize({
        width: size,
        height: size,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .toFile(iconPath)
  }

  async function processIconSet(iconSet) {
    await Promise.all(iconSet.map((icon) => generateIcon(icon)))
  }

  const iconExists = config.icon && fs.statSync(config.icon).isFile()

  if (!iconExists) {
    delete config.icon
    delete config.icons
    return config
  }

  await processIconSet(config.icons)

  return config
}
