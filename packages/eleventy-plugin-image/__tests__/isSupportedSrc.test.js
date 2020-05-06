const sinon = require('sinon')
const glob = require('glob')
const isSupportedSrc = require('../src/isSupportedSrc')

/**
 * By injecting a mocked 'glob' library, the tests don't need to very the actual glob library.
 * Instead, tests mock in the list of known files for a given glob pattern.  This lets the tests
 * make sure that isSupportedSrc handles the result properly without being hard-coded to glob.
 *
 * Include an integration test with the production glob package
 *
 * cases: [ _, include, globMap, src, expected ]
 * {String} _ Test case description
 * {Array} include Array of glob patterns
 * {Object} globMap Map from glob pattern to list of known files for isSupportedSrc
 * {String} src Filename that is being checked for plugin support
 * {Boolean} expected Expected value from isSupportedSrc
 */
const cases = [
  [
    'handles an empty config.includes',
    ['*.jpg'],
    { '*.jpg': [] },
    '/test.jpg',
    false,
  ],
  [
    'matches files in the current directory',
    ['*.jpg'],
    { '*.jpg': ['__tests__/fake.jpg', '__tests__/test.jpg'] },
    '/test.jpg',
    true,
  ],
  [
    'matches files in child directories',
    ['img/*.jpg'],
    { 'img/*.jpg': ['__tests__/img/fake.jpg', '__tests__/img/test.jpg'] },
    '/img/test.jpg',
    true,
  ],
]

describe('isSupportedSrc', () => {
  afterEach(() => sinon.restore())

  test.each(cases)('(unit) %p', (_, include, globMap, src, expected) => {
    include.forEach((key) => {
      sinon
        .stub(glob, 'sync')
        .withArgs(`__tests__/${key}`)
        .returns(globMap[key])
    })

    const config = { include, input: '__tests__' }
    const result = isSupportedSrc(config)({ src })

    expect(result).toBe(expected)
  })
})
