var MarkovChain = require('markovchainplus');
var fs = require('fs');
var util = require('util');

function train(textFile) {
    var model = new MarkovChain(fs.readFileSync(textFile, 'utf8'));
    return model;
}

console.log(util.inspect(train('text/office_reviews_s.txt'), {showHidden: false, depth: null}));
    