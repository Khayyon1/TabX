var MarkovChain = require('markovchainplus');
var models = [];
models.push(require('./models/library-model'));
models.push(require('./models/blogs-model'));
var mock = new MarkovChain("");

class WordPrediction {
    constructor(model) {
        this.model = model;
    }

    predictNextWord(input) {
        var suggestions = this.model.start(input).end(1).process(this.predictTopThree);
        return suggestions;
    }

    predictTopThree(inputStrs, wordBanks) {
        var suggestions = [];
        for (var i = 0; i < inputStrs.length; i++) {
            if (wordBanks[i][inputStrs[i]] != null) {
                var keys = Object.keys(wordBanks[i][inputStrs[i]]);
                var values = Object.values(wordBanks[i][inputStrs[i]]);
                while (suggestions.length < 10 && keys.length > 0) {
                    if (values.length > 1) {
                        var max = values.reduce(function(a, b) {
                        return Math.max(a, b);
                        }); 
                    }
                    else {
                        var max = values[0];
                    }

                    var predIndex = values.indexOf(max);
                    var prediction = keys[predIndex];
                    if (!suggestions.includes(prediction) && prediction.length > 1) {
                        suggestions.push(prediction);
                    }
                    keys.splice(predIndex, 1);
                    values.splice(predIndex, 1);
                }
            }
        }
        return suggestions;
    }
}

for (var i = 0; i < models.length; i++) {
    var currentMod = models[i];
    currentMod.start = mock.start;
    currentMod.end = mock.end;
    currentMod.process = mock.process;
    models[i] = currentMod;
}

var libraryModel = new WordPrediction(models[0]);
module.exports.libraryModel = libraryModel;
var blogsModel = new WordPrediction(models[1]);
module.exports.blogsModel = blogsModel;