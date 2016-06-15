# fontmachine

[![build status](https://secure.travis-ci.org/mapbox/fontmachine.png)](http://travis-ci.org/mapbox/fontmachine)

Make GL-ready pbfs and metadata for usage in fontstack API.


### `makeGlyphs(opts, callback)`

Make all metadata (codepoints) and SDF PBFs
necessary for Mapbox GL fontstacks.

### Parameters

| parameter  | type                                                                      | description                                                 |
| ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `opts`     | \{ font:Buffer, filetype: String \}                                       | An object with a font file and its file type (e.g. `.ttf`). |
| `callback` | Function                                                                  | Callback should take arguments (error, result).             |



**Returns** `Object`, font An object containing all files and data.
{String} font.name The name of this font (concatenated family_name + style_name).
{Array} font.stack An array of {name: filename, data: buffer} objects with SDF PBFs covering points 0-65535.
{Object} font.metadata An object containing the metadata (family_name and style_name) of the font .
{Object} font.codepoints An object where `data` is a stringified codepoints result.
{Object} font.original An object containing the original font file (named "original{.filetype}").

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install fontmachine
```

## Tests

```sh
$ npm test
```


