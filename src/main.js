const TabX = require('./tabx');
const FixedView = require("./assets/js/viewstrats/fixedstrat");
const TableView = require("./assets/js/viewstrats/tablestrat-ui");
const applySettings = require("./browserspec/settings");
const bgmodels = require("./models/messenger-models");
//const profanityfilter = require("./models/profanityfilter/profanity-filter");

//const mocknext = require("./models/mock/nextword_mock")
//const mockcomp = require("./models/mock/wordcomplete_mock")

let fixedDisplay = new FixedView(document);
let tableDisplay = new TableView(document);

let tabx = new TabX(bgmodels.WordCompleteModel,
   bgmodels.WordPredictModel,
   tableDisplay,
   document=document);

applySettings(tabx);
