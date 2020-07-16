WARNING: This is still experimental! We are using it internally, but haven't completed the test suite yet and the API surface may change. Use at your own risk!

# eleventy-plugin-inline-css

This [11ty](https://11ty.dev) plugin transforms `<link rel="stylesheet" href="styles.css">` tags in your rendered HTML into inlined, minified styles. It's meant to stay out of the way as much as possible to allow for whatever styling tools and dev setup you prefer.

## What it Does

It checks all rendered HTML for known stylesheets and replaces the `link` element with a `style` tag with the contents of your CSS file.

Because the plugin knows the rendered HTML and the supporting CSS, it is also able to leverage [PurgeCSS](https://purgecss.com/) and [clean-css](https://github.com/jakubpawlowicz/clean-css) to shake out all unused selectors and minify the CSS. Both `PurgeCSS` and `clean-css` can be disabled in config if you only want CSS files to be loaded inline.

## Default Options

```
{
  input: '', // root directory for CSS files
  cleanCss: {}, // options passed to the `clean-css` constructor, or `false` to disable minification
  purgeCss: {}, // options passed to `PurgeCSS`'s `purge` function, or `false` to disable purging
  selector: 'link[rel="stylesheet"]' // selector used to find stylesheet tags that should be inlined
}
```

NOTE: For the `purgeCss` options, the plugin will ignore options passed for `content` and `css`. These are always built to use the rendered HTML and CSS file.

## Usage

### 1. Install the Plugin

```
npm i --save @navillus/eleventy-plugin-inline-css
```

or

```
yarn add @navillus/eleventy-plugin-inline-css
```

### 2. Add the Plugin to Eleventy Config

```
// .eleventy.js

const pluginInlineCss = require('@navillus/eleventy-plugin-inline-css')

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginInlineCss, {
        input: 'src/assets', // look for all stylesheets relative to `./src/assets`
        cleanCss: false, // disable clean-css
        purgeCss: {
          defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [] // custom CSS extractor used for PurgeCSS
        }
    })
}
```

### 3. Add Stylesheet Links to Your Templates

In your template...

```
<link rel="stylesheet" href="css/main.css">
```

...with the plugin's `input` set to `src/assets` and this CSS file saved at `src/assets/css/main.css`

```
html, body {
  margin: 0;
  padding: 0;
}
```

...it will be rendered into

```
<style>html,body{margin:0;padding:0}</style>
```

### 4. Customize CSS Minification

You can disable `clean-css` by setting the plugin's `cleanCss` option to `false`, or override the default options by setting `cleanCss` to an object instead. This options object is passed directly to the `clean-css` constructor, see [the documentation](https://github.com/jakubpawlowicz/clean-css#constructor-options) for details on what is supported.

### 5. Cusomize CSS Purging

You can disable `purgecss` by setting the plugin's `purgeCss` option to `false`, or override the options sent to the `purge` function to an object instead. See [the documentation](https://purgecss.com/configuration.html#options) for full details.

Note that this plugin will always ignore `content` and `css` properties you provide via the `purgeCss`. These are always set to use the rendered HTML and CSS file found to purge unused selectors.

## Special Use Cases

### Only Inline Specific Stylesheets

Larger projects can often get huge benefits by splitting CSS up by priority, with one CSS file that has styles for your site's shell and above-the-fold content and a larger CSS file for everything else.

You can provide your own selector for this plugin to use when inlining styles. For example, for all stylesheets you want inlined you could add add a `data-inline` attribute and tell the plugin to only touch those files.

In your template...

```
<link rel="stylesheet" href="css/shell.css" data-inline>
<link rel="stylesheet" href="css/styles.css">
```

...and plugin config

```
eleventyConfig.addPlugin(pluginInlineCss, {
  selector: 'link[rel="stylesheet"][data-inline]'
})
```

...will be rendered to

```
<style>
  /* contents of "css/shell.css" */
</style>
<link rel="stylesheet" href="css/styles.css">
```
