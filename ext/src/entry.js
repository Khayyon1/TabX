const TabX = require('./tabx.js');
const WordCompleteModel = require("./lib/wordcompletion/triecomplete.js");
const WordPredictModel = require("./lib/wordpredction/markov/word-prediction");

var tabx = new TabX(WordCompleteModel, WordPredictModel);
