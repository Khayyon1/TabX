const TabX = require('./tabx');
const TableView = require("./assets/js/viewstrats/tablestrat-ui");
const applySettings = require("./browserspec/settings");
const bgmodels = require("./models/messenger-models");
const AbbrevExpansionModel = require("./models/abbreviationexpansion/abbreviation-expansion")

const ProfanityFilter = require("./models/profanityfilter/profanity-filter");

const mocknext = require("./models/mock/nextword_mock")
const mockcomp = require("./models/mock/wordcomplete_mock")

let tableDisplay = new TableView(document);
let abbrevExpansionModel = new AbbrevExpansionModel();
let filter = new ProfanityFilter()
let tabx = new TabX(mockcomp,
   mocknext,
   abbrevExpansionModel,
   tableDisplay,
   document=document,
   filter=filter,
   );

applySettings(tabx);
