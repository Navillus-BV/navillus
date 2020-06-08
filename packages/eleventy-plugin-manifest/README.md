WARNING:  This is still experimental!  We are using it internally, but haven't completed the test suite yet and the API surface may change.  Use at your own risk!


# @navillus/eleventy-plugin-manifest

This [11ty](https://11ty.dev) plugin builds a `manifest.webmanifest` file and supports resizing favicons automatically.

NOTE: This project is a work in progress! I make no promises beyond "it works on my machine!" right now. I am using it personally in a few projects, but it doesn't have any automated testing and it may need to expose extra config to be more broadly useful.

## Default Options

```
{
  output: 'dist',
  name: 'Eleventy',
  short_name: 'Eleventy',
  start_url: '/',
  background_color: '#ffffff',
  theme_color: '#222222',
  display: 'standalone',
  icon: 'assets/favicon.svg',
  icons: [
    {
      src: `icons/icon-48x48.png`,
      sizes: `48x48`,
      type: `image/png`,
    },
    {
      src: `icons/icon-72x72.png`,
      sizes: `72x72`,
      type: `image/png`,
    },
    {
      src: `icons/icon-96x96.png`,
      sizes: `96x96`,
      type: `image/png`,
    },
    {
      src: `icons/icon-144x144.png`,
      sizes: `144x144`,
      type: `image/png`,
    },
    {
      src: `icons/icon-192x192.png`,
      sizes: `192x192`,
      type: `image/png`,
    },
    {
      src: `icons/icon-256x256.png`,
      sizes: `256x256`,
      type: `image/png`,
    },
    {
      src: `icons/icon-384x384.png`,
      sizes: `384x384`,
      type: `image/png`,
    },
    {
      src: `icons/icon-512x512.png`,
      sizes: `512x512`,
      type: `image/png`,
    },
  ],
}
```

## Usage

### 1. Install the Plugin

```
npm i --save @navillus/eleventy-plugin-manifest
```

or

```
yarn add @navillus/eleventy-plugin-manifest
```

### 2. Add the Plugin to Eleventy Config

```
// .eleventy.js

const pluginManifest = require('@navillus/eleventy-plugin-manifest')

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginManifest)
}
```

### 3. Provide Manifest Config

You can override the default config in two different ways.

First, you can provide your own options when adding the plugin to your Eleventy config.

```
eleventyConfig.addPlugin(pluginManifest, {
    name: 'My App',
    icon: 'assets/img/uploads/favicon.png'
})
```

Second, you can provide your own options to the filter itself (see usage below). This can be useful if you use something like Netlify CMS to manage site settings consumed by Eleventy as data.

For example, make a `site.json` file in your `_data` directory

```
{
    "title": "My Site Title",
    "manifest": {
        "name": "My App",
        "icon": "assets/img/uploads/favicon.png"
    }
}
```

and provide that to the plugin's `manifest` filter

```
{{} site.manifest | manifest | safe }}
```

Both options can be used together. In this case, options passed to the `addPlugin` call will override the default plugin config, and data passed to the `manifest` filter will override both the default config and `addPlugin` options.

### Using the Filter

As shown above, the manifest is added to your templates with the provided `manifest` filter. Make sure to include this filter in your template `head` sections!

This filter will all requested favicons, if an `icon` option is provided, then will generate the `manifest.webmanifest` to match. Finally, the filter will return the HTML tags needed in the `head` to make the browser aware of the favicons and manifest file.

### Combine with eleventy-plugin-pwa

If you're looking for the full PWA experience, including service workers and "add to homescreen" support, this plugin pairs well with [eleventy-plugin-pwa](https://github.com/okitavera/eleventy-plugin-pwa).
