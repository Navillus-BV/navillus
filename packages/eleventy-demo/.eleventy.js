const eleventyImagePlugin = require('@navillus/eleventy-plugin-image')
const eleventyInlineCssPlugin = require('@navillus/eleventy-plugin-inline-css')
const eleventyManifestPlugin = require('@navillus/eleventy-plugin-manifest')

module.exports = function (eleventyConfig) {
  /**
   * Opts in to a full deep merge when combining the Data Cascade.
   *
   * @link https://www.11ty.dev/docs/data-deep-merge/#data-deep-merge
   */
  eleventyConfig.setDataDeepMerge(true)

  /**
   * Add custom watch targets
   *
   * @link https://www.11ty.dev/docs/config/#add-your-own-watch-targets
   */
  eleventyConfig.addWatchTarget('src/assets/')

  /**
   * Passthrough file copy
   *
   * @link https://www.11ty.dev/docs/copy/
   */
  eleventyConfig.addPassthroughCopy({ 'src/assets': '/' })

  /**
   * Add plugins
   *
   * @link https://www.11ty.devo/docs/plugins/
   */
  eleventyConfig.addPlugin(eleventyImagePlugin, {
    input: 'src/assets',
    output: 'dist',
    include: ['img/**/*.@(jpg|jpeg|png)'],
  })
  eleventyConfig.addPlugin(eleventyInlineCssPlugin, { input: 'src/assets' })
  eleventyConfig.addPlugin(eleventyManifestPlugin)

  return {
    dir: {
      input: 'src',
      output: 'dist',
      data: '_data',
      includes: '_includes',
      layouts: '_includes/layouts',
    },
    passthroughFileCopy: true,
    templateFormats: ['html', 'njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
