

const TabX = require('./tabx.js');
const WordCompleteModel = require("./lib/wordcompletion/triecomplete.js");
const WordPredictModel = require("./lib/wordprediction/markov/word-prediction");
const display = require("../assets/js/viewstrats/tablestrat");

require("../assets");

var tabx = new TabX(WordCompleteModel, WordPredictModel.newsModel, display, document);
