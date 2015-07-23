var tape = require('tape');
var fontmachine = require('../index.js');
var path = require('path');
var zlib = require('zlib');
var fs = require('fs');
var glyphComposite = require('glyph-pbf-composite');
var opensans = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/open-sans/OpenSans-Regular.ttf')));

tape('font machine', function(t) {
    fontmachine.makeGlyphs({font: opensans, filetype: '.ttf'}, function(err, font) {
        t.ifError(err);
        t.ok(font, 'returns a font');
        t.equal(font.name, 'Open Sans Regular');
        t.ok(font.metadata, 'metadata exists');
        t.ok(font.metadata instanceof Object, 'metadata is object');
        t.equal(font.metadata.family_name, 'Open Sans');
        t.equal(font.metadata.style_name, 'Regular');
        t.ok(font.codepoints, 'codepoints exists');
        t.ok(Array.isArray(font.codepoints), 'codepoints is array');
        t.ok(font.original, 'original font file exists');
        t.equal(font.original.name, 'original.ttf');
        t.deepEqual(font.original.data, opensans, 'Font files equal eachother');
        t.ok(font.stack, 'pbf stack exists');
        t.ok(Array.isArray(font.stack), 'pbf stack is array');
        var stack512 = font.stack.filter(function(stack) {
            return stack.name === '0-255.pbf';
        })[0];
        zlib.gunzip(stack512.data, function(err, rawBody) {
            t.ifError(err, 'gunzips successfully');
            var decodedStack = glyphComposite.decode(rawBody);
            t.ok(decodedStack.stacks, 'stack exists');
            t.equal(decodedStack.stacks.length, 1, 'Only one stack');
            t.ok(decodedStack.stacks[0].glyphs, 'glyphs exist');
            t.ok(decodedStack.stacks[0].glyphs.length > 0, 'There are glyphs');
            t.equal(decodedStack.stacks[0].name, 'Open Sans Regular');
            t.equal(decodedStack.stacks[0].range, '0-255');
            t.end();
        });
    });
});
