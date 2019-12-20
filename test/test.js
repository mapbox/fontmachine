'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const sinon = require('sinon');
const test = require('tap').test;
const fontnik = require('fontnik');
const rewire = require('rewire');
const fontmachine = rewire('../index.js');

const glyphComposite = require('@mapbox/glyph-pbf-composite');
const opensans = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/fonts/open-sans/OpenSans-Regular.ttf')));
const guardianbold = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/fonts/GuardianTextSansWeb/GuardianTextSansWeb-Bold.ttf')));
const noto = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/fonts/noto/NotoSans-Regular.ttc')));
const invalid = fs.readFileSync(path.resolve(path.join(__dirname, '/fixtures/fonts/invalid/foo.ttf')));

test('handle undefined style_name', (t) => {
  fontmachine.makeGlyphs({ font: guardianbold, filetype: '.ttf' }, (err, font) => {
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

test('handle api misuse opts.font', (t) => {
  t.throws(() => {
    fontmachine.makeGlyphs({ font: 'STRING' });
  }, /opts.font must be a Buffer/);
  t.end();
});

test('handle api misuse opts.filetype', (t) => {
  t.throws(() => {
    fontmachine.makeGlyphs({ font: Buffer.alloc(0), filetype: null });
  }, /opts.filetype must be a String/);
  t.end();
});

test('handle api misuse callback', (t) => {
  t.throws(() => {
    fontmachine.makeGlyphs({ font: Buffer.alloc(0), filetype: '.ttf' }, 'callback');
  }, /Callback must be a Function/);
  t.end();
});

test('handle not a font file', (t) => {
  fontmachine.makeGlyphs({ font: invalid, filetype: '.ttf' }, (err) => {
    t.ok(err);
    t.equal(err.message, 'could not open font file', 'Handles file that is not a font');
    t.end();
  });
});

test('handle multifont', (t) => {
  fontmachine.makeGlyphs({ font: noto, filetype: '.ttc' }, (err) => {
    t.ok(err);
    t.equal(err.message, 'Multiple faces in a font are not yet supported.', 'Calls callback with an error');
    t.end();
  });
});

test('calls-back with fontnik.range error', (t) => {
  const mockError = new Error();
  sinon.stub(fontnik, 'range').callsFake((_, cb) => cb(mockError));

  fontmachine.makeGlyphs({ font: opensans, filetype: '.ttf' }, (err, font) => {
    t.ok(err, 'has an error');
    t.equal(err, mockError, 'error passed along from fontnik.range');
    t.notOk(font, 'does not have font result');
    sinon.restore();
    t.done();
  });
});

test('calls-back with zlib.gzip error', (t) => {
  const mockError = new Error();
  sinon.stub(zlib, 'gzip').callsFake((_, cb) => cb(mockError));

  fontmachine.makeGlyphs({ font: opensans, filetype: '.ttf' }, (err, font) => {
    t.ok(err, 'has an error');
    t.equal(err, mockError, 'error passed along from zlib.gzip');
    t.notOk(font, 'does not have font result');
    sinon.restore();
    t.done();
  });
});

test('font machine 256-511', (t) => {
  fontmachine.makeGlyphs({ font: opensans, filetype: '.ttf' }, (err, font) => {
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
    const stack512 = font.stack.filter((stack) => {
      return stack.name === '256-511.pbf';
    })[0];
    zlib.gunzip(stack512.data, (err, rawBody) => {
      t.ifError(err, 'gunzips successfully');
      const decodedStack = glyphComposite.decode(rawBody);
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

test('font machine 7680-7935', (t) => {
  fontmachine.makeGlyphs({ font: opensans, filetype: '.ttf' }, (err, font) => {
    t.ifError(err);
    const stack512 = font.stack.filter((stack) => {
      return stack.name === '7680-7935.pbf';
    })[0];
    zlib.gunzip(stack512.data, (err, rawBody) => {
      t.ifError(err, 'gunzips successfully');
      const decodedStack = glyphComposite.decode(rawBody);
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

test('can set processing concurrency', (t) => {
  const opts = {
    font: opensans,
    filetype: '.ttf',
    concurrency: 1 // process glyph ranges serially
  };

  const writeGlyphs = fontmachine.__get__('writeGlyphs');
  const writeGlyphsSpy = sinon.spy(writeGlyphs);
  const unset = fontmachine.__set__('writeGlyphs', writeGlyphsSpy);

  fontmachine.makeGlyphs(opts, (err, font) => {
    t.ifError(err);
    t.ok(font, 'returns a font');

    t.ok(writeGlyphsSpy.called, 'writeGlyphs is called');

    const calls = writeGlyphsSpy.getCalls();
    t.equal(calls.length, 256, 'writeGlyphs called expected number of times');

    for (let i = 0; i < calls.length; i++) {
      // ensure that all calls to writeSpy were processed in sequential order
      const call = calls[i];
      t.equal(call.args[1], i * 256, 'start argument');
      t.equal(call.args[2], (i + 1) * 256 - 1, 'end argument');
    }

    unset();
    sinon.restore();
    t.done();
  });
});
