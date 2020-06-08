const CleanCSS = require('clean-css')
const { identity, merge } = require('ramda')

function minifyCss(config) {
  const cleancss = new CleanCSS(merge({}, config.cleanCss))

  return function({ css, ...rest }) {
    const { styles } = cleancss.minify(css)

    return merge(rest, { css: styles })
  }
}

module.exports = function(config) {
  return config.cleanCss
    ? minifyCss(config)
    : identity
}