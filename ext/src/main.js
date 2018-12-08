const TabX = require('./tabx.js');
const display = require("../assets/js/viewstrats/tablestrat");
require("../assets");

var WordCompleteModel = {
    predictCurrentWord: function(input){return messageBackgroundPage("WORD_COMPLETE", input)}
}

var WordPredictModel = {
    predictNextWord: function(input){return messageBackgroundPage("WORD_PREDICT", input)}
}

var tabx = new TabX(WordCompleteModel, WordPredictModel, display, document);
tabx.registerEventListeners();


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

