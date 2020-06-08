const CleanCSS = require('clean-css')
const { identity, merge } = require('ramda')
const debug = require('./debug')

function minifyCss(config) {
  const cleancss = new CleanCSS(merge({}, config.cleanCss))

  return function({ css, from, ...rest }) {
    debug('Minifying %s', from)
    
    const { styles } = cleancss.minify(css)

    return merge(rest, { css: styles, from })
  }
}

module.exports = function(config) {
  if (config.cleanCss) {
    debug('config.cleanCss is falsy, skipping CleanCSS minification')
  }

  return config.cleanCss
    ? minifyCss(config)
    : identity
}