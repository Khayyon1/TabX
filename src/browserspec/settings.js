function applySettings(tabx)
{
   chrome.storage.local.get(function (results)
   {
      if (results != null)
      {
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

         let config =
         {
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

var actions =
{
   "enableTabX": (tabx) => { tabx.enable() },
   "disableTabX": (tabx) => { tabx.disable() },
   "enableWordCompletion": (tabx) => { tabx.enableWordCompletion() },
   "enableWordPrediction": (tabx) => { tabx.enableWordPrediction() },
   "disableWordCompletion": (tabx) => { tabx.disableWordCompletion() },
   "disableWordPrediction": (tabx) => { tabx.disableWordPrediction() },
   "updateDisplay": (tabx) =>
   {
      chrome.storage.local.get(function(results)
      {
         let config =
         {
            font: results["Font"],
            fontsize: results["Font Size"],
            fontstyle: results["Font Style"],
            fontcolor: results["Font Color"]
         };

         tabx.configureDisplay(config);
      });
   },

   "suggestionsQuantityChange": (tabx) =>
   {
      chrome.storage.local.get(function(results)
      {
         let quantity = results["Suggestions Quantity"];
         if(quantity == null || quantity == undefined || quantity == 0)
         {
            quantity = 3;
         }

         tabx.setSuggestionsDisplayCount(quantity);

      });
   }
}

function listenForSettingChanges(tabx)
{
   chrome.runtime.onMessage.addListener(function(message, sender, sendResponse)
   {
      console.log("received message: " + message);
      let action = actions[message];
      action(tabx);
   });
}

module.exports = applySettings
