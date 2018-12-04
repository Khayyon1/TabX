var MarkovChain = require('markovchain');
var fs = require('fs');
var util = require('util');

function train(textFile) {
    var model = new MarkovChain(fs.readFileSync(textFile, 'utf8'));
    return model;
}

console.log(util.inspect(train('poeTrain.txt'), {showHidden: false, depth: null}));
    