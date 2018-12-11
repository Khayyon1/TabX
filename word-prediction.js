var MarkovChain = require('markovchainplus');
var models = [];
models.push(require('./models/fake-model'));
models.push(require('./models/poe-model'));
models.push(require('./models/library-model'));
models.push(require('./models/news-model'));
models.push(require('./models/blogs-model'));
models.push(require('./models/brown-model'));
models.push(require('./models/blogs-model1'));
models.push(require('./models/model2'));
var mock = new MarkovChain("");

class WordPrediction {
    constructor(model) {
        this.model = model;
    }

    predictNextWord(input) {
        //does input string have space at the end?
        //lowercase uppercase thing - search both
        //when parsing and making initial markov chain, if lowercase of a word already exists and you get an uppercase,
        // or vice versa, then combine all entries into only the lowercase
        //upgrade markov model to parse actual punctuation... ; and () ....
        // *figure out the undefined thing for new model
        //cite text data sets used

        //var word = input.split(" ").pop();
        // var split = input.split(" ");
        // var phrase = split[split.length-3] + " " + split[split.length-2] + " " + split[split.length-1];
        var suggestions = this.model.start(input).end(1).process(this.predictTopThree);
        return suggestions;
    }

    predictTopThree(strings, wordBanks) {
        var suggestions = [];
        for (var i = 0; i < strings.length; i++) {
            if (wordBanks[i][strings[i]] != null) {
                var keys = Object.keys(wordBanks[i][strings[i]]);
                var values = Object.values(wordBanks[i][strings[i]]);
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

//takes too much time to load all

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
var blogsModel2 = new WordPrediction(models[6]);
module.exports.blogsModel2 = blogsModel2;