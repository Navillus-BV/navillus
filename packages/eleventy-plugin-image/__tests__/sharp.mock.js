module.exports = function (meta) {
  const mockSharp = {
    jpeg: jest.fn(),
    metadata: jest.fn(),
    png: jest.fn(),
    webp: jest.fn(),
    resize: jest.fn(),
    toFile: jest.fn(),
  }

  const jpeg = jest.spyOn(mockSharp, 'jpeg').mockImplementation(() => mockSharp)
  const metadata = jest
    .spyOn(mockSharp, 'metadata')
    .mockImplementation(() => Promise.resolve(meta))
  const png = jest.spyOn(mockSharp, 'png').mockImplementation(() => mockSharp)
  const webp = jest.spyOn(mockSharp, 'webp').mockImplementation(() => mockSharp)
  const resize = jest
    .spyOn(mockSharp, 'resize')
    .mockImplementation(() => mockSharp)
  const toFile = jest
    .spyOn(mockSharp, 'toFile')
    .mockImplementation(() => mockSharp)

  const mockRestore = () => {
    jpeg.mockRestore()
    metadata.mockRestore()
    png.mockRestore()
    webp.mockRestore()
    resize.mockRestore()
    toFile.mockRestore()
  }

  const mock = () => jest.mock('sharp', () => () => mockSharp)

  return {
    mock,
    mockRestore,
    jpeg,
    metadata,
    png,
    webp,
    resize,
    toFile,
  }
}
