function applySettings(tabx)
{
    chrome.storage.local.get(function (results)
    {
        if (results != null) {
            console.log("Current word enabled: " + results["Current Word"]);
            console.log("Next word enables: " + results["Next Word"]);

            if (!results['activated'])
            {
                console.log("Disabled upon init");
                tabx.disable();
            }

            if(!results["Current Word"])
            {
                tabx.disableWordCompletion();
            }

            if(!results["Next Word"])
            {
                tabx.disableWordPrediction();
            }

            let config = {
                font: results["Font"],
                fontsize: results["Font Size"],
                fontstyle: results["Font Style"],
                fontcolor: results["Font Color"]
            };

            tabx.configureDisplay(config);
            listenForSettingChanges(tabx);
        }
    })
};

function listenForSettingChanges(tabx){
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

    else if(message == "updateDisplay")
    {
      chrome.storage.local.get(function(results){
         let config = {
            font: results["Font"],
            fontsize: results["Font Size"],
            fontstyle: results["Font Style"],
            fontcolor: results["Font Color"]
         };

         tabx.configureDisplay(config);
      });

    }
})
}

module.exports = applySettings
