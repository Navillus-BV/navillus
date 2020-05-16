const { JSDOM } = require('jsdom')
const prepareSizes = require('../src/prepareSizes')

describe('prepareSizes', () => {
  test('returns the imgElem untouched', async () => {
    const sizes = [400, 800, 1200]
    const config = { sizes }

    const width = 850
    const original = { width }

    const src = 'img/test.jpg'
    const output = 'img/test.jpg'
    const reference = { output, src }

    const { window } = new JSDOM()
    const imgElem = window.document.createElement('img')
    imgElem.src = src

    const result = await prepareSizes(config)({ imgElem, original, reference })

    expect(result).toBeDefined()
    expect(result.imgElem).toBe(imgElem)
  })

  test("always includes the original image's width", async () => {
    const sizes = [400, 800, 1200]
    const config = { sizes }

    const width = 850
    const original = { width }

    const src = 'img/test.jpg'
    const output = 'img/test_16x9.jpg'
    const reference = { output, src }

    const { window } = new JSDOM()
    const imgElem = window.document.createElement('img')
    imgElem.src = src

    const result = await prepareSizes(config)({ imgElem, original, reference })

    expect(result).toBeDefined()
    expect(result.sizes).toBeDefined()
    expect(result.sizes.some((size) => size.width === width)).toBeTruthy()
  })

  test('returns the original width and all smaller config sizes', async () => {
    const sizes = [400, 800, 1200]
    const config = { sizes }

    const width = 850
    const original = { width }

    const src = 'img/test.jpg'
    const output = 'img/test.jpg'
    const reference = { output, src }

    const { window } = new JSDOM()
    const imgElem = window.document.createElement('img')
    imgElem.src = src

    const result = await prepareSizes(config)({ imgElem, original, reference })

    expect(result).toBeDefined()
    expect(result.sizes).toBeDefined()
    expect(result.sizes.length).toBe(3)
    expect(result.sizes).toEqual([
      { src: 'img/test-400.jpg', output: 'img/test-400.jpg', width: 400 },
      { src: 'img/test-800.jpg', output: 'img/test-800.jpg', width: 800 },
      { src: 'img/test-850.jpg', output: 'img/test-850.jpg', width: 850 },
    ])
  })

  test('handles images that are being output with an aspect in the filename', async () => {
    const sizes = [400, 800, 1200]
    const config = { sizes }

    const width = 850
    const original = { width }

    const src = 'img/test.jpg'
    const output = 'img/test_16x9.jpg'
    const reference = { output, src }

    const { window } = new JSDOM()
    const imgElem = window.document.createElement('img')
    imgElem.src = src

    const result = await prepareSizes(config)({ imgElem, original, reference })

    expect(result).toBeDefined()
    expect(result.sizes).toBeDefined()
    expect(result.sizes.length).toBe(3)
    expect(result.sizes).toEqual([
      { src: 'img/test-400.jpg', output: 'img/test_16x9-400.jpg', width: 400 },
      { src: 'img/test-800.jpg', output: 'img/test_16x9-800.jpg', width: 800 },
      { src: 'img/test-850.jpg', output: 'img/test_16x9-850.jpg', width: 850 },
    ])
  })

  test("doesn't return any sizes for inlined images", async () => {
    const sizes = [400, 800, 1200]
    const config = { sizes }

    const width = 850
    const original = { width }

    const src = 'img/test.jpg'
    const output = 'img/test_16x9.jpg'
    const inline = true
    const reference = { output, src, inline }

    const { window } = new JSDOM()
    const imgElem = window.document.createElement('img')
    imgElem.src = src

    const result = await prepareSizes(config)({ imgElem, original, reference })

    expect(result).toBeDefined()
    expect(result.sizes).toBeDefined()
    expect(result.sizes).toEqual([])
  })
})
