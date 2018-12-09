const WordCompleteModel = require("./lib/wordcompletion/triecomplete/wordCompletion/wordCompletionModel");
const WordPredictModel = require("./lib/wordprediction/markov/word-prediction");


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse)
  {
    if (request.TabxOp != null)
    {
        if(request.TabxOp == "WORD_COMPLETE")
        {
            sendResponse({TabxResults: WordCompleteModel.predictCurrentWord(request.TabxInput)});
        }

        else if(request.TabxOp == "WORD_PREDICT")
        {
            sendResponse({TabxResults: WordPredictModel.newsModel.predictNextWord(request.TabxInput)});
        }
    }
  });

