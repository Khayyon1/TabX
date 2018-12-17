var MarkovChain = require('markovchainplus');
var models = [];
models.push(require('./models/library-model-small'));
models.push(require('./models/blogs-model-small'));
var mock = new MarkovChain("");

class WordPrediction {
    constructor(model) {
        this.model = model;
    }

    predictNextWord(input) {
        //cite text data sets used
        //remove cuss words/"porn" from wordbank
        //train models on bigger text corpus
        //update predictnextword for all 3 word predictions
        

        var suggestions = this.model.start(input).end(1).process(this.predictTopThree);
        return suggestions;
    }

    predictTopThree(strings, wordBanks) {
        var suggestions = [];
        for (var i = 0; i < strings.length; i++) {
            if (wordBanks[i][strings[i]] != null) {
                var keys = Object.keys(wordBanks[i][strings[i]]);
                var values = Object.values(wordBanks[i][strings[i]]);
                while (suggestions.length < 10 && keys.length > 0) {
                    if (values.length > 1) {
                        var max = values.reduce(function(a, b) {
                        return Math.max(a, b);
                        }); 
                    }
                    else {
                        var max = values[0];
                    }
                    var originalPrediction = keys[values.indexOf(max)];
                    if (originalPrediction.length > 0) {
                        var predictionSplit = originalPrediction.split(/[^a-z , ' ’ a-zA-Z.\-_]/i);
                        var prediction;
                        if (/[a-z , ' ’ a-zA-Z.\-_]/i.test(predictionSplit[0])) {
                            prediction = predictionSplit[0];
                        }
                        else {
                            prediction = predictionSplit[1];
                        }
                    }
                    if (!(suggestions.includes(prediction)) && prediction.length > 0) {
                        suggestions.push(prediction);
                    }
                    var index = keys.indexOf(originalPrediction);
                    keys.splice(index, 1);
                    values.splice(index, 1);
                }
            }
        }
        return suggestions;
    }
}

for (var i = 0; i < models.length; i++) {
    var current = models[i];
    current.start = mock.start;
    current.end = mock.end;
    current.process = mock.process;
    models[i] = current;
}

var libraryModelSmall = new WordPrediction(models[0]);
module.exports.libraryModelSmall = libraryModelSmall;
var blogsModelSmall = new WordPrediction(models[1]);
module.exports.blogsModelSmall = blogsModelSmall;
