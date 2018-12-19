// Module which trains word prediction models using a modified Markov chain algorithm

var MarkovChain = require('markovchainplus');
var fs = require('fs');
var util = require('util');

function train(textFile) {
    var model = new MarkovChain(fs.readFileSync(textFile, 'utf8'));
    return model;
}

console.log(util.inspect(train('text/blogs_m.txt'), {showHidden: false, depth: null}));
    