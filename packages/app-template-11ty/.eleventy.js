module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ static: '/' })

  return {
    templateFormats: ['md', 'njk', 'html', '11ty.js'],

    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',

    dir: {
      input: '_template',
      includes: '../_includes',
      input: 'site',
      includes: '_includes',
      output: '_output',
      data: '_data'
    }
  }
}
