const consumeOriginal = require('../src/consumeOriginal')

jest.mock('fs', () => ({
  stat: () => ({
    size: 9000
  })
}))

jest.mock('sharp', () => () => ({
  jpeg: () => ({
    png: () => ({
      webp: () => ({
        metadata: () => ({ height: 900, width: 1200, size: 9000 }),
      }),
    }),
  }),
}))

describe('consumeOriginal', () => {
  test('returns an object with the original imgElem', async () => {
    const config = { input: 'assets' }
    const imgElem = { src: '/img/test.jpg' }

    const result = await consumeOriginal(config)({ imgElem })

    expect(result).toBeDefined()
    expect(result.imgElem).toBe(imgElem)
  })

  test('returns an original.src prop including the plugin input config', async () => {
    const config = { input: 'assets' }
    const imgElem = { src: '/img/test.jpg' }

    const result = await consumeOriginal(config)({ imgElem })

    expect(result).toBeDefined()
    expect(result.original).toBeDefined()
    expect(result.original.src).toBe('assets/img/test.jpg')
  })

  test('returns original.height and original.width', async () => {
    const config = { input: 'assets' }
    const imgElem = { src: '/img/test.jpg' }

    const result = await consumeOriginal(config)({ imgElem })

    expect(result).toBeDefined()
    expect(result.original).toBeDefined()
    expect(result.original.height).toBe(900)
    expect(result.original.width).toBe(1200)
  })

  test('returns original.aspectRatio', async () => {
    const config = { input: 'assets' }
    const imgElem = { src: '/img/test.jpg' }

    const result = await consumeOriginal(config)({ imgElem })

    expect(result).toBeDefined()
    expect(result.original).toBeDefined()
    expect(result.original.aspectRatio).toBe(1200 / 900)
  })

  test('returns original.size', async () => {
    const config = { input: 'assets' }
    const imgElem = { src: '/img/test.jpg' }

    const result = await consumeOriginal(config)({ imgElem })

    expect(result).toBeDefined()
    expect(result.original).toBeDefined()
    expect(result.original.size).toBe(9000)
  })
})
