var fontnik = require('fontnik');
var queue = require('queue-async');
var zlib = require('zlib');


/**
 * Make all metadata (codepoints) and SDF PBFs
 * necessary for Mapbox GL fontstacks.
 * @param {{font: Buffer, filetype: String}} opts An object with a font file and its file type (e.g. `.ttf`).
 * @param {Function} callback Callback should take arguments (error, result).
 * @returns {undefined} calls callback
 *
 * * {String} font.fontname The name of this font (concatenated family_name + style_name).
 * * {Array} font.stack An array of {name: filename, data: buffer} objects with SDF PBFs covering points 0-65535.
 * * {Object} font.metadata An object where `data` is a stringified codepoints result.
 * * {Object} font.original An object containing the original font file (named "original{.filetype}")
 */
function makeGlyphs(opts, callback) {
    // undefined (unset concurrency) means unbounded concurrency in d3-queue
    var q = queue(opts.concurrency);
    var stack = [];

    if (!(opts.font instanceof Buffer)) throw new Error('opts.font must be a Buffer');
    if (typeof opts.filetype !== 'string') throw new Error('opts.filetype must be a String');
    if (!(callback instanceof Function)) throw new Error('Callback must be a Function');

    fontnik.load(opts.font, function(err, faces) {
        if (err) {
            return callback(err);
        }

        if (faces.length > 1) {
            return callback(new Error('Multiple faces in a font are not yet supported.'));
        }

        var metadata = faces[0];

        for (var i = 0; i < 65536; (i = i + 256)) {
            q.defer(writeGlyphs, opts.font, i, Math.min(i + 255, 65535));
        }

        q.awaitAll(function(err) {
            if (err) return callback(err);
            return callback(null, {
                name: metadata.style_name ? [metadata.family_name, metadata.style_name].join(' ') : metadata.family_name,
                stack: stack,
                metadata: Object.keys(metadata).reduce(function(prev, key, index) {
                    if (key !== 'points') {
                        prev[key] = metadata[key];
                    }

                    return prev;
                }, {}),
                codepoints: metadata.points,
                original: {
                    name: 'original' + opts.filetype,
                    data: opts.font
                }
            });
        });
    });

    function writeGlyphs(font, start, end, done) {
        fontnik.range({font: font, start: start, end: end}, function(err, data) {
            if (err) {
                return done(err);
            }
            var name = [start, '-', end, '.pbf'].join('');
            zlib.gzip(data, function(err, res) {
                if (err) {
                    return done(err);
                }
                stack.push({
                    name: name,
                    data: res
                });
                return done(null);
            });
        });
    }
}

module.exports.makeGlyphs = makeGlyphs;
