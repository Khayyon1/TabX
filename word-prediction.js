var MarkovChain = require('markovchain');
var models = [];
models.push(require('./models/fake-model'));
models.push(require('./models/poe-model'));
models.push(require('./models/library-model'));
models.push(require('./models/news-model'));
models.push(require('./models/blogs-model'));
models.push(require('./models/brown-model'));
var mock = new MarkovChain("");

class WordPrediction {
    constructor(model) {
        this.model = model;
    }

    predictNextWord(word) {
        var suggestions = this.model.start(word).end(1).process(this.predictTopThree);
        return suggestions;
    }

    predictTopThree(curWord, wordBank) {
        if (wordBank[curWord] != null) {
            var keys = Object.keys(wordBank[curWord]);
            var values = Object.values(wordBank[curWord]);
            var suggestions = [];
            
            while (suggestions.length < 3 && keys.length > 0) {
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
                    var predictionSplit = originalPrediction.split(/[^a-z ' ’]/i);
                    var prediction;
                    if (predictionSplit[0].match(/[a-z]/i)) {
                        prediction = predictionSplit[0];
                    }
                    else {
                        prediction = predictionSplit[1];
                    }
                    if (prediction.match(/[a-z]/i)) {
                        prediction = prediction[0] + prediction.slice(1).toLowerCase();
                    }
                }
                if (!(suggestions.includes(prediction)) && prediction.length > 0) {
                    suggestions.push(prediction);
                }
                var index = keys.indexOf(originalPrediction);
                keys.splice(index, 1);
                values.splice(index, 1);
            }
            return suggestions;
        }
        else {
            return [];
        }
    }
}

for (var i = 0; i < models.length; i++) {
    var current = models[i];
    current.start = mock.start;
    current.end = mock.end;
    current.process = mock.process;
    models[i] = current;
}

var fakeModel = new WordPrediction(models[0]);
module.exports.fakeModel = fakeModel;
var poeModel = new WordPrediction(models[1]);
module.exports.poeModel = poeModel;
var libraryModel = new WordPrediction(models[2]);
module.exports.libraryModel = libraryModel;
var newsModel = new WordPrediction(models[3]);
module.exports.newsModel = newsModel;
var blogsModel = new WordPrediction(models[4]);
module.exports.blogsModel = blogsModel;
var brownModel = new WordPrediction(models[5]);
module.exports.brownModel = brownModel;