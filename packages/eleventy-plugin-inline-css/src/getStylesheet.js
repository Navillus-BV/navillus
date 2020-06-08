const fs = require('fs')
const { PurgeCSS } = require('purgecss')
const debug = require('./debug')

module.exports = function(config) {
  return function(html) {
    async function loadWithPurge(from) {
      debug('loading %s with PurgeCSS', from)

      const [{ css }] = await new PurgeCSS()
        .purge({
          ...config.purgeCss,
          content: [{
            raw: html,
            extension: 'html'
          }],
          css: [ from ]
        })
      
      return css
    }

    async function loadWithFs(from) {
      debug('loading %s without PurgeCSS', from)
      
      return fs.promises.readFile(from, 'utf-8')
    }
    
    return async function({ from, ...rest }) {
      const css = await config.purgeCss
        ? loadWithPurge(from)
        : loadWithFs(from)

      return {
        ...rest,
        from,
        css
      }
    }
  }
}
