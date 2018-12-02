const TabX = require('./tabx.js');
const WordCompleteModel = require("./lib/wordcompletion/triecomplete.js");
const WordPredictModel = undefined;

var tabx = new TabX(WordCompleteModel, WordPredictModel);
