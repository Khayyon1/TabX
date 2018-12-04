const TabX = require('./tabx.js');
const WordCompleteModel = require("./lib/wordcompletion/triecomplete.js");
const WordPredictModel = require("./lib/wordprediction/markov/word-prediction");

var tabx = new TabX(WordCompleteModel, WordPredictModel, document);
