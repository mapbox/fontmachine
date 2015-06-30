# fontmachine

[![NPM](https://nodei.co/npm/fontmachine.png)](https://npmjs.org/package/fontmachine)

[![Build Status](https://travis-ci.org/mapbox/fontmachine.svg?branch=master)](https://travis-ci.org/mapbox/fontmachine)

Make GL-ready PBFs and metadata for use in glyphs API.

## Usage

### `makeGlyphs(opts, callback)`

Make all metadata (codepoints) and SDF PBFs
necessary for Mapbox GL fontstacks.

### Parameters

| parameter  | type                                                                      | description                                                 |
| ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `opts`     | { font: Buffer, filetype: <code>String</code> } | An object with a font file and its file type (e.g. `.ttf`). |
| `callback` | Function                                                                  | Callback should take arguments (error, result).             |

**Returns** `Object`, font An object containing all files and data.
* {String} font.fontname The name of this font (concatenated family_name + style_name).
* {Array} font.stack An array of {name: filename, data: buffer} objects with SDF PBFs covering points 0-65535.
* {Object} font.metadata An object where `data` is a stringified codepoints result.
* {Object} font.original An object containing the original font file (named "original{.filetype}")

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install fontmachine
```

## Tests

```sh
$ npm test
```
