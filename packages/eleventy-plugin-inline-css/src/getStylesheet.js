const fs = require('fs')
const { PurgeCSS } = require('purgecss')
const debug = require('./debug')

module.exports = function (config) {
  return function (html) {
    function loadWithPurge(from) {
      debug('loading %s with PurgeCSS', from)

      return new PurgeCSS()
        .purge({
          ...config.purgeCss,
          content: [
            {
              raw: html,
              extension: 'html',
            },
          ],
          css: [from],
        })
        .then(([{ css }]) => css)
    }

    function loadWithFs(from) {
      debug('loading %s without PurgeCSS', from)

      return fs.promises.readFile(from, 'utf-8')
    }

    return async function ({ from, ...rest }) {
      const css = config.purgeCss
        ? await loadWithPurge(from)
        : await loadWithFs(from)

      return {
        ...rest,
        from,
        css,
      }
    }
  }
}
