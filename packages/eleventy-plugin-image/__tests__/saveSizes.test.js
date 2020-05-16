const saveSizes = require('../src/saveSizes')
const mockSharp = require('./sharp.mock')()

beforeAll(mockSharp.mock)
afterEach(jest.clearAllMocks)
afterAll(mockSharp.mockRestore)

describe('saveSizes', () => {
  test('calls sharp.resize once with the only the requested width', async () => {
    const config = {
      input: 'assets',
      quality: 70,
      compressionLevel: 8,
      webpOptions: { quality: 75, lossless: false, force: true },
    }

    const reference = {
      output: 'img/test_16x9-800.jpg',
    }

    const output = 'img/test_16x9-600.jpg'
    const width = 600
    const size = { output, width }
    const sizes = [size]

    const result = await saveSizes(config)({ reference, sizes, imgElem: {} })

    expect(result).toBeDefined()

    expect(mockSharp.resize.mock.calls.length).toBe(1)
    expect(mockSharp.resize.mock.calls[0][0]).toEqual({
      width,
    })
  })

  test('calls sharp.toFile once with the only the requested size.output', async () => {
    const config = {
      input: 'assets',
      quality: 70,
      compressionLevel: 8,
      webpOptions: { quality: 75, lossless: false, force: true },
    }

    const reference = {
      output: 'img/test_16x9-800.jpg',
    }

    const output = 'img/test_16x9-600.jpg'
    const width = 600
    const size = { output, width }
    const sizes = [size]

    const result = await saveSizes(config)({ reference, sizes, imgElem: {} })

    expect(result).toBeDefined()

    expect(mockSharp.toFile.mock.calls.length).toBe(1)
    expect(mockSharp.toFile.mock.calls[0][0]).toEqual(output)
  })

  test('handles an empty list of sizes', async () => {
    const config = {
      input: 'assets',
      quality: 70,
      compressionLevel: 8,
      webpOptions: { quality: 75, lossless: false, force: true },
    }

    const reference = {
      output: 'img/test_16x9-800.jpg',
    }
    const sizes = []

    const result = await saveSizes(config)({ reference, sizes, imgElem: {} })

    expect(result).toBeDefined()

    expect(mockSharp.resize.mock.calls.length).toBe(0)
    expect(mockSharp.toFile.mock.calls.length).toBe(0)
  })

  test('calls sharp.resize and toFile once for each given size', async () => {
    const config = {
      input: 'assets',
      quality: 70,
      compressionLevel: 8,
      webpOptions: { quality: 75, lossless: false, force: true },
    }

    const reference = {
      output: 'img/test_16x9-800.jpg',
    }

    const size1 = { output: 'img/test_16x9-600.jpg', width: 600 }
    const size2 = { otuput: 'img/test/16x9-800.jpg', width: 800 }
    const size3 = { output: 'img/test/16x9-1600.jpg', width: 1600 }
    const sizes = [size1, size2, size3]

    const result = await saveSizes(config)({ reference, sizes, imgElem: {} })

    expect(result).toBeDefined()

    expect(mockSharp.resize.mock.calls.length).toBe(3)
    expect(mockSharp.toFile.mock.calls.length).toBe(3)

    expect(mockSharp.resize.mock.calls).toEqual([
      [{ width: size1.width }],
      [{ width: size2.width }],
      [{ width: size3.width }],
    ])
  })
})
