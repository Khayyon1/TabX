function config(tabx) {
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
        }
    })
};

module.exports = config;