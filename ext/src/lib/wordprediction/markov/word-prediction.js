var MarkovChain = require('markovchainplus');
var models = [];
models.push(require('./models/library-model2'));
models.push(require('./models/blogs-model2'));
models.push(require('./models/library-model3'));
models.push(require('./models/blogs-model3'));
var mock = new MarkovChain("");

class WordPrediction {
    constructor(model) {
        this.model = model;
    }

    predictNextWord(input) {
        //can input string have punctuation? deal with punctuation - commas, periods, etc. 
        //do we even want to remove something like commas, since they affect word prediction?
        //leave punctuation in the middle of a sentence IN the training model, but remove end of sentence words from word bank. also when getting suggestions from wordbank, 
        //remve all punctuation

        //lowercase uppercase thing - search both
        //when parsing and making initial markov chain, if lowercase of a word already exists and you get an uppercase,
        // or vice versa, then combine all entries into only the lowercase

        //upgrade markov model to parse actual punctuation... ; and () ....
        // *figure out the undefined thing for new model

        //cite text data sets used

        //punctuation and commas in trained model/input??

        //train models on bigger text corpus

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
                        var predictionSplit = originalPrediction.split(/[^a-z ' ’ a-zA-Z.\-_]/i);
                        var prediction;
                        if (predictionSplit[0].match(/[a-z]/i)) {
                            prediction = predictionSplit[0];
                        }
                        else {
                            prediction = predictionSplit[1];
                        }
                        // if (prediction.match(/[a-z]/i)) {   ---include this in og training
                        //     prediction = prediction[0] + prediction.slice(1).toLowerCase();
                        // }
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

var libraryModel = new WordPrediction(models[0]);
module.exports.libraryModel = libraryModel;
var blogsModel = new WordPrediction(models[1]);
module.exports.blogsModel = blogsModel;
var libraryModelLarge = new WordPrediction(models[2]);
module.exports.libraryModelLarge = libraryModelLarge;
var blogsModelLarge = new WordPrediction(models[3]);
module.exports.blogsModelLarge = blogsModelLarge;