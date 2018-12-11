var test = require('./word-prediction');

var sigs = test.libraryModel.predictNextWord("print");
console.log(sigs);
//library: [ 'out', 'on', 'a' ], slower
//brown: [ 'if', 'line' ] for print, slowest
//news: out
//blogs: [ 'all', 'projects', 'ad' ], closest to everyday speech
//fake: none
