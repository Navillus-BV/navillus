const prepareReference = require('../src/prepareReference')

describe('prepareReference', () => {
  test('returns imgElem untouched', () => {
    const config = { output: 'dist' }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {},
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.imgElem).toBe(imgElem)
  })

  test('returns original untouched', () => {
    const config = { output: 'dist' }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {},
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.original).toBe(original)
  })

  test('returns reference.src without an aspect ratio', () => {
    const config = { output: 'dist' }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {},
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      aspectRatio: 900 / 1200,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.src).toBe(imgElem.src)
  })

  test('returns reference.height and width from the original', () => {
    const config = { output: 'dist' }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {},
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.height).toBe(original.height)
    expect(result.reference.width).toBe(original.width)
  })

  test('returns reference.aspectRatio from the original', () => {
    const config = { output: 'dist' }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {},
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.aspectRatio).toBe(original.aspectRatio)
  })

  test('recalculates height when imgElem aspect ratio requires it', () => {
    const config = { output: 'dist' }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {
        aspectHeight: 9,
        aspectWidth: 16,
      },
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.height).toBe(675)
    expect(result.reference.width).toBe(original.width)
  })

  test('recalculates width when imgElem aspect ratio requires it', () => {
    const config = { output: 'dist' }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {
        aspectHeight: 9,
        aspectWidth: 16,
      },
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 2400,
      aspectRatio: 2400 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.aspectRatio).toBe(16 / 9)
    expect(result.reference.height).toBe(original.height)
    expect(result.reference.width).toBe(1600)
  })

  test('returns reference.aspectRatio calculated from imgElem if provided', () => {
    const config = { output: 'dist' }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {
        aspectHeight: 9,
        aspectWidth: 16,
      },
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.aspectRatio).toBe(16 / 9)
    expect(result.reference.width).toBe(original.width)
    expect(result.reference.height).toBe(675)
  })

  test('returns false for reference.inline with images larger than config.inlineBelow', () => {
    const config = { output: 'dist', inlineBelow: 10000 }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {},
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      size: 10001,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.inline).toBeFalsy()
  })

  test('returns true for reference.inline with images smaller than config.inlineBelow', () => {
    const config = { output: 'dist', inlineBelow: 10000 }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {},
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      size: 9999,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.inline).toBeTruthy()
  })

  test('returns false for reference.inline with images equal to config.inlineBelow', () => {
    const config = { output: 'dist', inlineBelow: 10000 }
    const imgElem = {
      src: '/img/test.jpg',
      dataset: {},
    }
    const original = {
      src: '/img/test.jpg',
      height: 900,
      width: 1200,
      size: 10000,
      aspectRatio: 1200 / 900,
    }

    const result = prepareReference(config)({ imgElem, original })

    expect(result).toBeDefined()
    expect(result.reference).toBeDefined()
    expect(result.reference.inline).toBeFalsy()
  })
})
