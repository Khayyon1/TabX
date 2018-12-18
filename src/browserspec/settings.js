const FixedView = require("../assets/js/viewstrats/fixedstrat");
const TableView = require("../assets/js/viewstrats/tablestrat-ui");

function applySettings(tabx)
{
   chrome.storage.local.get(function (results)
   {
      if (results != null)
      {
         if (!results['activated'])
         {
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

         if(results["Suggestions Quantity"])
         {
            tabx.setSuggestionsDisplayCount(results["Suggestions Quantity"]);
         }

         if(results["View Strategy"])
         {
            actions["viewStratChange"](tabx);
         }

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
         if(!quantity || quantity === 0)
         {
            quantity = 3;
         }

         tabx.setSuggestionsDisplayCount(quantity);

      });
   },

   "viewStratChange": (tabx) =>
   {
      chrome.storage.local.get(function(results)
      {
         let strat = results["View Strategy"];

         if(!strat || strat === "Follow Input")
         {
            strat = new TableView(tabx.document);
         }

         else if(strat === "Footer View")
         {
            strat = new FixedView(tabx.document);
         }

         tabx.setDisplay(strat);

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
