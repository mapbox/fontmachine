var tape = require('tape');
var fontmachine = require('../index.js');
var path = require('path');
var zlib = require('zlib');
var fs = require('fs');
var glyphComposite = require('glyph-pbf-composite');
var opensans = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/fonts/open-sans/OpenSans-Regular.ttf')));
var guardianbold = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/fonts/GuardianTextSansWeb/GuardianTextSansWeb-Bold.ttf')));

tape('handle undefined style_name', function(t) {
    fontmachine.makeGlyphs({font: guardianbold, filetype: '.ttf'}, function(err, font) {
        t.ifError(err);
        t.ok(font, 'returns a font');
        t.equal(font.name, '?');
        t.ok(font.metadata, 'metadata exists');
        t.ok(font.metadata instanceof Object, 'metadata is object');
        t.equal(font.metadata.family_name, '?');
        t.equal(font.metadata.style_name, undefined);
        t.ok(font.codepoints, 'codepoints exists');
        t.ok(Array.isArray(font.codepoints), 'codepoints is array');
        t.equal(font.codepoints.length, 227, 'right number of codepoints');
        t.ok(font.original, 'original font file exists');
        t.equal(font.original.name, 'original.ttf');
        t.deepEqual(font.original.data, guardianbold, 'Font files equal eachother');
        t.ok(font.stack, 'pbf stack exists');
        t.equal(font.stack.length, 256, 'font stack has the right size');
        t.ok(Array.isArray(font.stack), 'pbf stack is array');
        t.end();
    });
});

tape('font machine 256-511', function(t) {
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
        t.equal(font.codepoints.length, 882, 'right number of codepoints');
        t.ok(font.original, 'original font file exists');
        t.equal(font.original.name, 'original.ttf');
        t.deepEqual(font.original.data, opensans, 'Font files equal eachother');
        t.ok(font.stack, 'pbf stack exists');
        t.equal(font.stack.length, 256, 'font stack has the right size');
        t.ok(Array.isArray(font.stack), 'pbf stack is array');
        var stack512 = font.stack.filter(function(stack) {
            return stack.name === '256-511.pbf';
        })[0];
        zlib.gunzip(stack512.data, function(err, rawBody) {
            t.ifError(err, 'gunzips successfully');
            var decodedStack = glyphComposite.decode(rawBody);
            t.ok(decodedStack.stacks, 'stack exists');
            t.equal(decodedStack.stacks.length, 1, 'Only one stack');
            t.ok(decodedStack.stacks[0].glyphs, 'glyphs exist');
            t.equal(decodedStack.stacks[0].glyphs.length, 140, 'There are glyphs');
            t.equal(decodedStack.stacks[0].name, 'Open Sans Regular');
            t.equal(decodedStack.stacks[0].range, '256-511');
            t.equal(decodedStack.stacks[0].glyphs[0].id, 256, 'correct first id');
            t.equal(decodedStack.stacks[0].glyphs[0].width, 15, 'correct first width');
            t.equal(decodedStack.stacks[0].glyphs[0].height, 20, 'correct first height');
            t.equal(decodedStack.stacks[0].glyphs[0].left, 0, 'correct first left');
            t.equal(decodedStack.stacks[0].glyphs[0].top, -6, 'correct first top');
            t.equal(decodedStack.stacks[0].glyphs[0].advance, 15, 'correct first advance');
            t.equal(decodedStack.stacks[0].glyphs[75].id, 331, 'correct 76th id');
            t.equal(decodedStack.stacks[0].glyphs[75].width, 11, 'correct 76th width');
            t.equal(decodedStack.stacks[0].glyphs[75].height, 19, 'correct 76th height');
            t.equal(decodedStack.stacks[0].glyphs[75].left, 2, 'correct 76th left');
            t.equal(decodedStack.stacks[0].glyphs[75].top, -13, 'correct 76th top');
            t.equal(decodedStack.stacks[0].glyphs[75].advance, 14, 'correct 76th advance');
            t.end();
        });
    });
});

tape('font machine 7680-7935', function(t) {
    fontmachine.makeGlyphs({font: opensans, filetype: '.ttf'}, function(err, font) {
        t.ifError(err);
        var stack512 = font.stack.filter(function(stack) {
            return stack.name === '7680-7935.pbf';
        })[0];
        zlib.gunzip(stack512.data, function(err, rawBody) {
            t.ifError(err, 'gunzips successfully');
            var decodedStack = glyphComposite.decode(rawBody);
            t.ok(decodedStack.stacks, 'stack exists');
            t.equal(decodedStack.stacks.length, 1, 'Only one stack');
            t.ok(decodedStack.stacks[0].glyphs, 'glyphs exist');
            t.equal(decodedStack.stacks[0].glyphs.length, 100, 'There are glyphs');
            t.equal(decodedStack.stacks[0].name, 'Open Sans Regular');
            t.equal(decodedStack.stacks[0].range, '7680-7935');
            t.equal(decodedStack.stacks[0].glyphs[0].id, 7680, 'correct first id');
            t.equal(decodedStack.stacks[0].glyphs[0].width, 15, 'correct first width');
            t.equal(decodedStack.stacks[0].glyphs[0].height, 24, 'correct first height');
            t.equal(decodedStack.stacks[0].glyphs[0].left, 0, 'correct first left');
            t.equal(decodedStack.stacks[0].glyphs[0].top, -9, 'correct first top');
            t.equal(decodedStack.stacks[0].glyphs[0].advance, 15, 'correct first advance');
            t.equal(decodedStack.stacks[0].glyphs[75].id, 7905, 'correct 76th id');
            t.equal(decodedStack.stacks[0].glyphs[75].width, 14, 'correct 76th width');
            t.equal(decodedStack.stacks[0].glyphs[75].height, 18, 'correct 76th height');
            t.equal(decodedStack.stacks[0].glyphs[75].left, 1, 'correct 76th left');
            t.equal(decodedStack.stacks[0].glyphs[75].top, -8, 'correct 76th top');
            t.equal(decodedStack.stacks[0].glyphs[75].advance, 14, 'correct 76th advance');
            t.end();
        });
    });
});
