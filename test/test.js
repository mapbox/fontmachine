var tape = require('tape');
var fontmachine = require('../index.js');
var path = require('path');
var fs = require('fs');
var opensans = fs.readFileSync(path.resolve(__dirname + '/fixtures/open-sans/OpenSans-Regular.ttf'));
var firasans = fs.readFileSync(path.resolve(__dirname + '/fixtures/firasans-medium/FiraSans-Medium.ttf'));

tape('font machine', function(t) {
    fontmachine.makeGlyphs({font: opensans, filetype: '.ttf'}, function(err, res) {
        t.ifError(err);
        t.ok(res);
        t.equal(res.fontname, 'Open Sans Regular');
        t.ok(Array.isArray(res.stack));
        t.ok(res.metadata);
        t.equal(res.metadata.name, 'Open Sans Regular.json');
        t.ok(Array.isArray(JSON.parse(res.metadata.data).body));
        t.ok(res.original);
        t.equal(res.original.name, 'original.ttf');
        t.end();
    });
});
