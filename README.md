# DEPRECATED @mapbox/fontmachine

[![Build Status](https://travis-ci.org/mapbox/fontmachine.svg?branch=master)](https://travis-ci.org/mapbox/fontmachine) [![codecov](https://codecov.io/gh/mapbox/fontmachine/branch/master/graph/badge.svg)](https://codecov.io/gh/mapbox/fontmachine)

:warning: This code is deprecated, which means it is no longer maintained and will not receive updates. Instead of this library, we recommend using [node-fontnik](https://github.com/mapbox/node-fontnik) directly.

Make GL-ready pbfs and metadata for usage in fontstack API.

### `makeGlyphs(opts, callback)`

Make all metadata (codepoints) and SDF PBFs necessary for Mapbox GL fontstacks.

### Parameters

| parameter            | type                     | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `opts`               | `Object`                   | Options object with required `font` and `filetype` properties, and any optional parameters.                                                                                                                                                                                                                                                                                                                                                                                         |
| `opts.font`          | `Buffer`                   | The font file as a `Buffer`.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `opts.filetype`      | `string`                   | Type of font (e.g. `'.ttf'` or `'.otf'`).                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `[opts.concurrency]` | `number`                   | _optional:_ Concurrency to use when processing font into PBFs. If `undefined`, concurrency is unbounded.                                                                                                                                                                                                                                                                                                                                                                            |
| `callback`           | `function(err, result)` | Callback takes arguments (`error`, `result`).

### Callback `result`

| property   | type                                  | description                                                                                 |
| ---------- | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| `name`     | `string`                              | The name of this font (concatenated family_name + style_name).                              |
| `stack`    | `Array<{name: string, data: Buffer}>` | An array of 256 `{name: filename, data: buffer}` objects with SDF PBFs covering points 0-65535. |
| `metadata` | `{family_name: string, style_name: string}`                              | Metadata about the font.                                  |
| `codepoints` | `Array<int>` | Array of codepoints covered by the font.
| `original` | `{name: string, data: Buffer}`        | An object containing the original font file (named `'original<filetype>'`)                 |

## Installation

Requires [nodejs](http://nodejs.org/).

```sh
$ npm install @mapbox/fontmachine
```

## Tests

```sh
$ npm test
```

