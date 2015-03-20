# fontmachine

Make GL-ready pbfs and metadata for usage in fontstack API.


### `makeGlyphs(file, callback)`

Make all metadata (codepoints) and SDF PBFs
necessary for Mapbox GL fontstacks.

### Parameters

| parameter  | type     | description                                     |
| ---------- | -------- | ----------------------------------------------- |
| `file`     | String   | A path to a font file.                          |
| `callback` | Function | Callback should take arguments (error, result). |



**Returns** `Object`, font An object containing all files and data.
* {String} font.fontname The name of this font (concatenated family_name + style_name).
* {Array} font.stack An array of {name: filename, data: buffer} objects with SDF PBFs covering points 0-65535.
* {Object} font.metadata An object where `data` is a stringified codepoints result.
* {Object} font.original An object containing the original font file (named "original.{extname}")

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install fontmachine
```

## Tests

```sh
$ npm test
```
