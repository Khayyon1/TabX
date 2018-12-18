const WordCompleteModel = require("./wordcompletion/triecomplete/trieModelFinal");
const WordPredictModel = require("./wordprediction/markov/word-prediction-medium");

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse)
   {
      if (request.TabxOp != null)
      {
         try{
            if(request.TabxOp == "WORD_COMPLETE")
            {

               let results = WordCompleteModel.predictCurrentWord(request.TabxInput);

               if(isInvalid(results))
               {
                  results = [];
               }

               console.log("RESULTS WORD COMP: " + results)
               sendResponse({TabxResults: results});
            }

            else if(request.TabxOp == "WORD_PREDICT")
            {
               let results = WordPredictModel.libraryModelMedium.predictNextWord(request.TabxInput);
               if(isInvalid(results))
               {
                  results = [];
               }

               console.log("RESULTS WORD PRED: " + results)
               sendResponse({TabxResults: results});
            }

            return;
         }

         catch(err)
         {
            console.log("ERROR: " + err.stack);
            sendResponse({TabxResults: []});
         }

      }
   });

   function isInvalid(results)
   {
      return results == null || results == undefined || results.length == 0;
   }
