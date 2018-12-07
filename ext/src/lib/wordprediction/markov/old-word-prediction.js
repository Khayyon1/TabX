var MarkovChain = require('markovchain');
var models = [];
models.push(require('./fake-model'));
models.push(require('./poe-model'));
models.push(require('./library-model'));
models.push(require('./news-model'));
models.push(require('./blogs-model'));
models.push(require('./brown-model'));
var mock = new MarkovChain("");

class WordPrediction {
    constructor(model) {
        this.model = model;
    }

    predictNextWord(word) {
        var suggestions = [];
        var iter = 0;
        while (suggestions.length < 3 && iter < 20) {
            var prediction = this.model.start(word).end(1).process().substring((word.length + 1));
            if (prediction.length > 0) {
                var predictionSplit = prediction.split(/[^a-z ' ’]/i);
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
            iter++;
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