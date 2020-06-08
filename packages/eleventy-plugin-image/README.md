WARNING:  This is still experimental!  We are using it internally, but haven't completed the test suite yet and the API surface may change.  Use at your own risk!


# @navillus/eleventy-plugin-image

This [11ty](https://11ty.dev) plugin transforms `<img>` tags in your rendered HTML to responsive images. Drop the large master image into your `assets` directory and let the plugin handle resizing and optimizing download size!

## What it Does

A pixelated copy of the image will be inlined directly into the HTML for immediately rendering a blurry placeholder image.

[lazysizes](https://github.com/aFarkas/lazysizes) is added to the page to support lazy loading of images.

The `img` element is updated to include a `srcset` for all sizes listed in the plugin options. Sizes will be excluded if they are bigger than the original image, and the original image width will always be included as an option even if it wasn't listed in the plugin's options.

The plugin also supports forcing image aspect ratios via custom `data-` attributes (see below).

## Default Options

```
{
  input: 'assets', // root directory for original images
  output: 'dist', // root directory for processed images

  // Case insensitive. Only files whose extension exist in this array will be
  // processed by the <img> tag (assuming `optimizeAll` above is true). Empty
  // the array to allow all extensions to be processed. However, only jpegs and
  // pngs are explicitly supported.
  include: ['img/*.+(jpg|jpeg|png)'],

  inlineBelow: 10000, // inline all images in img tag below 10kb

  compressionLevel: 8, // png quality level
  quality: 70, // jpeg/webp quality level

  sizes: [400, 800, 1200], // array of sizes for srcset in pixels

  // WebP options [sharp docs](https://sharp.pixelplumbing.com/en/stable/api-output/#webp)
  webpOptions: { quality: 75, lossless: false, force: true },
  webp: true,

  // source for lazysizes.min.js
  scriptSrc: 'https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js',
}
```

## Usage

### 1. Install the Plugin

```
npm i --save @navillus/eleventy-plugin-image
```

or

```
yarn add @navillus/eleventy-plugin-image
```

### 2. Add the Plugin to Eleventy Config

```
// .eleventy.js

const pluginImage = require('@navillus/eleventy-plugin-image')

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginImage, {
        input: 'src/assets',
        // ...plugin options
    })
}
```

### 3. Add Images to your Pages

In your template...

```
<img src="/img/uploads/hero.jpg">
```

...will be rendered into

```
<img src="/img/uploads/hero.jpg"
    data-srcset="/img/uploads/hero-400.jpg 400w, /img/uploads/hero-800.jpg 800w, /img/uploads/hero-1200.jpg 1200w"
    data-src="auto"
    srcset="data:image/png;base64,/9j/2wBDAAoHB..."
    class="lazyload blur-up">
```

Lets break that down.

**src** isn't modified. The original file will be copied to your output directory and will be available as a fallback in case the browser, for example, has javascript disabled and blocks [lazysizes](https://github.com/aFarkas/lazysizes).

**data-srcset** is a list of available sizes for the browser to pick from. We're using `data-srcset` instead of the usual `srcset` for [lazysizes](https://github.com/aFarkas/lazysizes).

**data-src** is another [lazysizes](https://github.com/aFarkas/lazysizes#automatically-setting-the-sizes-attribute) option allowing the library to automatically set the `sizes` attribute.

**srcset** provides a 64px wide blurry placeholder image inline as a base64 image. This will get replaced by the real image asset once it is loaded.

**class** - the `lazyload` class is used by [lazysizes](https://github.com/aFarkas/lazysizes#how-to) and ties together the `data-src` and `data-srcset` attributes. The `blur-up` class is provided by this plugin to blur the placeholder images and fade in the real assets once loaded.

### 4. Force an Aspect Ratio, Fit, and Position

The library supports four extra `dataset` attributes to allow you to force and aspect ratio and define the `fit` and `position` of the resized image.

#### Force an Aspect Ratio

```
<img src="/img/assets/hero.jpg" data-aspect-width="16" data-aspect-height="9" />
```

will be rendered into

```
<img src="/img/uploads/hero_16x9.jpg"
    data-srcset="/img/uploads/hero_16x9-400.jpg 400w, /img/uploads/hero_16x9-800.jpg 800w, /img/uploads/hero_16x9-1200.jpg 1200w"
    data-src="auto"
    srcset="data:image/png;base64,/9j/2wBDAAoHB..."
    class="lazyload blur-up">
```

The plugin will crop the original asset to a 16:9 ratio, centered on the original image and stretched to cover the full 16:9 box.

Note: When provided, the aspect ratio will be included in the file names similar to `_16x9` above. The original image is cropped to the given aspect ratio and output without further shrinking the width. All requested sizes will both be cropped to the aspect ratio and given widths.

#### Define Fit and Position for Resizing

When forcing an aspect ratio, you can also define the `fit` and `position` used by the [sharp](https://sharp.pixelplumbing.com/api-resize) library during resizing.

`data-aspect-fit` isn't usually necessary when you are purposely forcing an aspect ratio, but it is exposed just in case. `<img data-aspect-fit="contain" />` would pass `contain` to the resizing library.

`data-aspect-position` lets you define which part of the image you want to be centered after it is cropped down. Especially when you are making a big change to the original image's aspect ratio, you may want to do `<img data-aspect-position="right top">` to make sure the content in the upper right corner is not lost.

## Testing

Jest tests are in place for all the business logic of the plugin. The image resizing library is mocked during testing to avoid tests touching the local filesystem, but tests to cover parameters sent to `sharp`.

Use `npm run test` or `yarn test` to run them locally.
