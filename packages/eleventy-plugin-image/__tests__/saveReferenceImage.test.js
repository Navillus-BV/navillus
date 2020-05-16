const saveReferenceImage = require('../src/saveReferenceImage')
const mockSharp = require('./sharp.mock')()

beforeAll(mockSharp.mock)
afterEach(jest.clearAllMocks)
afterAll(mockSharp.mockRestore)

describe('saveReferenceImage', () => {
  test('calls sharp.resize once with the correct options', async () => {
    const config = {
      input: 'assets',
      quality: 70,
      compressionLevel: 8,
      webpOptions: { quality: 75, lossless: false, force: true },
    }

    const src = 'img/test.jpg'
    const original = { src }

    const output = 'img/test_16x9-800.jpg'
    const height = 675
    const width = 900
    const fit = 'fill'
    const position = 'centre'
    const reference = { output, height, width, fit, position }

    const result = await saveReferenceImage(config)({ original, reference, imgElem: {} })

    expect(result).toBeDefined()

    expect(mockSharp.resize.mock.calls.length).toBe(1)
    expect(mockSharp.resize.mock.calls[0][0]).toEqual({
      height,
      width,
      fit,
      position,
    })
  })

  test('calls sharp.toFile once with the correct options', async () => {
    const config = {
      input: 'assets',
      quality: 70,
      compressionLevel: 8,
      webpOptions: { quality: 75, lossless: false, force: true },
    }

    const src = 'img/test.jpg'
    const original = { src }

    const output = 'img/test_16x9-800.jpg'
    const height = 675
    const width = 900
    const fit = 'fill'
    const position = 'centre'
    const reference = { output, height, width, fit, position }

    const result = await saveReferenceImage(config)({ original, reference, imgElem: {} })

    expect(result).toBeDefined()

    expect(mockSharp.toFile.mock.calls.length).toBe(1)
    expect(mockSharp.toFile.mock.calls[0][0]).toEqual(reference.output)
  })

  test('does not call sharp.resize or sharp.toFile if image is inlined', async () => {
    const config = {
      input: 'assets',
      quality: 70,
      compressionLevel: 8,
      webpOptions: { quality: 75, lossless: false, force: true },
    }

    const src = 'img/test.jpg'
    const original = { src }

    const output = 'img/test_16x9.jpg'
    const height = 675
    const width = 900
    const fit = 'fill'
    const position = 'centre'
    const inline = true
    const reference = { output, height, width, fit, position, inline }

    const result = await saveReferenceImage(config)({ original, reference, imgElem: {} })

    expect(result).toBeDefined()

    expect(mockSharp.resize.mock.calls.length).toBe(0)
    expect(mockSharp.toFile.mock.calls.length).toBe(0)
  })
})
