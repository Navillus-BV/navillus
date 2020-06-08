const fs = require('fs')
const { PurgeCSS } = require('purgecss')

module.exports = function(config) {
  return function(html) {
    async function loadWithPurge(from) {
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
