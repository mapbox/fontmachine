var fontnik = require('fontnik');
var queue = require('queue-async');
var zlib = require('zlib');
var path = require('path');
var fs = require('fs');

var fontmachine = module.exports = {};

/**
 * Make all metadata (codepoints) and SDF PBFs
 * necessary for Mapbox GL fontstacks.
 * @param {String} file A path to a font file.
 * @param {Function} callback Callback should take arguments (error, result).
 * @returns {Object} font An object containing all files and data.
 *
 * * {String} font.fontname The name of this font (concatenated family_name + style_name).
 * * {Array} font.stack An array of {name: filename, data: buffer} objects with SDF PBFs covering points 0-65535.
 * * {Object} font.metadata An object where `data` is a stringified codepoints result.
 * * {Object} font.original An object containing the original font file (named "original.{extname}")
 */
fontmachine.makeGlyphs = function(file, callback) {
    var q = queue();
    var stack = [];
    fontnik.load(file, function(err, faces) {
        if (err) return callback(err);
        if (faces.length > 1) throw new Error('woah multifont!');

        var metadata = faces[0];
        var name = [metadata.family_name, metadata.style_name].join(' ');

        var codepoints = JSON.stringify({
            body: metadata.points
        });

        for (var i = 0; i < 65536; (i = i + 256)) {
            q.defer(writeGlyphs, file, i, Math.min(i + 255, 65535));
        }

        q.awaitAll(function(err) {
            if (err) return callback(err);
            return callback(null, {
                fontname: name,
                stack: stack,
                metadata: {
                    name: name + '.json',
                    data: codepoints
                },
                original: {
                    name: 'original' + path.extname(file),
                    data: fs.readFileSync(file)
                }
            });
        });
    });

    function writeGlyphs(file, start, end, done) {
        fontnik.range(file, start, end, function(err, data) {
            if (err) return done(err);
            var name = [start, '-', end, '.pbf'].join('');
            zlib.gzip(data, function(err, res) {
                if (err) return done(err);
                stack.push({
                    name: name,
                    data: data
                });
                return done(null, res);
            });
        });
    }
};
