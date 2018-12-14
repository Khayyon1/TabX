const WordCompleteModel = require("../src/lib/wordcompletion/triecomplete/trieModelFinal.js");
const WordPredictModel = require("./lib/wordprediction/markov/word-prediction");


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
               let results = WordPredictModel.newsModel.predictNextWord(request.TabxInput);
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
            console.log("ERROR: " + err)
            sendResponse({TabxResults: []});
         }

      }
   });

   function isInvalid(results)
   {
      return results == null || results == undefined || results.length == 0;
   }
