const TabX = require('./tabx.js');
const TableView = require("../assets/js/viewstrats/tablestrat");
require("../assets");
const config = require("../browserspec/chrome/settings");

var WordCompleteModel = {
    predictCurrentWord: function(input){return messageBackgroundPage("WORD_COMPLETE", input)}
}

var WordPredictModel = {
    predictNextWord: function(input){return messageBackgroundPage("WORD_PREDICT", input)}
}

let display = new TableView(document);
let tabx = new TabX(WordCompleteModel, WordPredictModel,
    display,
    document)
tabx.registerListeners();
config(tabx);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse)
{
    console.log("received message: " + message)
    if(message == "enableTabX") {
        tabx.enable();
        console.log("I was enabled");
    }

    else if(message == "disableTabX") {
        tabx.disable();
        console.log("I was disabled");
    }

    else if(message == "enableWordPrediction")
    {
        console.log("enabled Word Prediction")
        tabx.enableWordPrediction();
    }
    else if(message == "enableWordCompletion")
    {
        console.log("enabled Word Completion")

        tabx.enableWordCompletion();
    }

    else if(message == "disableWordPrediction")
    {
        console.log("disabled Word Prediction")

        tabx.disableWordPrediction();
    }

    else if(message == "disableWordCompletion")
    {
        console.log("disabled Word Completion");

        tabx.disableWordCompletion();
    }
});

async function messageBackgroundPage(request, input)
{
    let response = new Promise(function(resolve, reject)
    {
        chrome.runtime.sendMessage({"TabxOp": request, "TabxInput": input}, function (response) {
            resolve(response.TabxResults);
        });
    });

    console.log("before results");
    let results = await response;
    console.log("after results: " + results);

    return results;
}

