const Sharp = require('sharp')

module.exports = function (config) {
  return function (src) {
    return Sharp(src)
      .jpeg({ quality: config.quality, progressive: false, force: false })
      .png({ compressionLevel: config.compressionLevel, force: false })
      .webp({ quality: config.quality, lossless: true, force: false })
  }
}
