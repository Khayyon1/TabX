var MarkovChain = require('markovchain')
var fs = require('fs')

function chain() {
    var text = new MarkovChain(fs.readFileSync('poeTrain.txt', 'utf8'));
    return text;
}

var text = chain();

function predictNextWord(word) {
    var predictions = [];
    var iter = 0;
    while (predictions.length < 3 && iter < 50) {
        var prediction = text.start("because").end(1).process().substring((word.length + 1));
        if (!(predictions.includes(prediction))) {
            predictions.push(prediction);
        }
        iter++;
    }
    return predictions;
}

console.log(predictNextWord("because"))