const TabX = require('./tabx.js');
const TableView = require("../assets/js/viewstrats/tablestrat");
require("../assets");

var WordCompleteModel = {
    predictCurrentWord: function(input){return messageBackgroundPage("WORD_COMPLETE", input)}
}

var WordPredictModel = {
    predictNextWord: function(input){return messageBackgroundPage("WORD_PREDICT", input)}
}

//Before Constructor is called
//      Check Settings for what features are enabled

var tabx;

chrome.storage.local.get(function(results)
{
    if(results != null)
    {
        console.log("Current word enabled: " + results["Current Word"]);
        console.log("Next word enables: " + results["Next Word"]);
        let display = new TableView(document);
        tabx = new TabX(WordCompleteModel, WordPredictModel,
            display,
            document,
            wordCompleteEnabled=results["Current Word"],
            wordPredictEnabled=results['Next Word']);

        tabx.registerListeners();

        if(!results['activated'])
        {
            console.log("Disabled upon init");
            tabx.disable();
        }

        console.log("I was created");
    }
});


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

