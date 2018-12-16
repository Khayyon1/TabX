const TabX = require('./tabx');
const TableView = require("./assets/js/viewstrats/fixedstrat");
const applySettings = require("./browserspec/settings");
const bgmodels = require("./models/messenger-models");

let display = new TableView(document);
let tabx = new TabX(bgmodels.WordCompleteModel,
   bgmodels.WordPredictModel,
   display,
   document);

applySettings(tabx);
