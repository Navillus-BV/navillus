const navigationPlugin = require('@11ty/eleventy-navigation')
const manifestPlugin = require('@navillus/eleventy-plugin-manifest')
const seoPlugin = require('eleventy-plugin-seo')
const svgContentsPlugin = require('eleventy-plugin-svg-contents')
const { DateTime } = require('luxon')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItToc = require('markdown-it-table-of-contents')
const slugify = require('slugify')

const build = require('./site/_data/build')
const site = require('./site/_data/site.json')

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

  /**
   * Passthrough file copy
   *
   * @link https://www.11ty.dev/docs/copy/
   */
  eleventyConfig.addPassthroughCopy({ static: '/' })

  /**
   * Add filters
   *
   * @link https://www.11ty.dev/docs/filters/
   */
  eleventyConfig.addFilter('dateDisplay', (dateObj, format = 'LLL d, y') => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc',
    }).toFormat(format)
  })

  /**
   * Add plugins
   *
   * @link https://www.11ty.devo/docs/plugins/
   */
  eleventyConfig.addPlugin(navigationPlugin)
  eleventyConfig.addPlugin(svgContentsPlugin)
  eleventyConfig.addPlugin(seoPlugin, {
    title: site.name,
    description: site.description,
    url: site.url,
    author: site.author,
    image: site.images.social,
    ogtype: 'website',
    options: { titleDivider: '|' },
  })
  eleventyConfig.addPlugin(manifestPlugin, {
    output: '_output',
    name: site.name,
    short_name: site.name,
    icon: site.images.favicon,
  })

  /**
   * Override default markdown library
   */
  function removeExtraText(s) {
    let newStr = String(s).replace(/New\ in\ v\d+\.\d+\.\d+/, '')
    newStr = newStr.replace(/⚠️/g, '')
    newStr = newStr.replace(/[?!]/g, '')
    newStr = newStr.replace(/<[^>]*>/g, '')
    return newStr
  }

  function markdownItSlugify(s) {
    return slugify(removeExtraText(s), { lower: true, remove: /[:’'`,]/g })
  }

  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  })
    .use(markdownItAnchor, {
      permalink: true,
      slugify: markdownItSlugify,
      permalinkBefore: false,
      permalinkClass: 'direct-link',
      permalinkSymbol: '',
      level: [1, 2, 3, 4],
    })
    .use(markdownItToc, {
      includeLevel: [2, 3],
      slugify: markdownItSlugify,
      format: function (header) {
        return removeExtraText(header)
      },
      transformLink: function (link) {
        // remove backticks from markdown code
        return link.replace(/\%60/g, '')
      },
    })

  eleventyConfig.setLibrary('md', md)

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
      data: '_data',
    },
  }
}
