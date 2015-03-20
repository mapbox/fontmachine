var fontnik = require('fontnik');
var queue = require('queue-async');
var zlib = require('zlib');
var path = require('path');
var fs = require('fs');

var fontmachine = module.exports = {};

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
