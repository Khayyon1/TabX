var MarkovChain = require('markovchain')
var fs = require('fs')

class WordPrediction {
    constructor() {
        this.model = this.train();
    }

    train() {
        var model = new MarkovChain(fs.readFileSync('poeTrain.txt', 'utf8'));
        return model;
    }
    
    predictNextWord(word) {
        var predictions = [];
        var iter = 0;
        while (predictions.length < 3 && iter < 50) {
            var prediction = this.model.start(word).end(1).process().substring((word.length + 1));
            if (!(predictions.includes(prediction))) {
                predictions.push(prediction);
            }
            iter++;
        }
        return predictions;
    }
}

module.exports = WordPrediction;