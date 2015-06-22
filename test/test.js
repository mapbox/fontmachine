var tape = require('tape');
var fontmachine = require('../index.js');
var path = require('path');
var fs = require('fs');
var opensans = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/open-sans/OpenSans-Regular.ttf')));

tape('font machine', function(t) {
    fontmachine.makeGlyphs({font: opensans, filetype: '.ttf'}, function(err, font) {
        t.ifError(err);
        t.ok(font, 'returns a font');
        t.equal(font.name, 'Open Sans Regular');
        t.ok(font.stack, 'pbf stack exists');
        t.ok(Array.isArray(font.stack), 'pbf stack is array');
        t.ok(font.metadata, 'metadata exists');
        t.ok(font.metadata instanceof Object, 'metadata is object');
        t.ok(font.codepoints, 'codepoints exists');
        t.ok(Array.isArray(font.codepoints), 'codepoints is array');
        t.ok(font.original, 'original font file exists');
        t.equal(font.original.name, 'original.ttf');
        t.end();
    });
});
