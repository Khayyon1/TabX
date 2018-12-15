async function messageBackgroundPage(request, input)
{
   let response = new Promise(function(resolve, reject)
   {
      console.log("MSG: " + request + "(" + input + ")" + typeof(input));
      chrome.runtime.sendMessage({"TabxOp": request, "TabxInput": input},
      function (response) {
         resolve(response.TabxResults);
      });
   });

   let results = await response;
   console.log("RESULTS: " + results);

   return results;
}

var WordCompleteModelMSGER = {
   predictCurrentWord: function(input)
   {
      return messageBackgroundPage("WORD_COMPLETE", input)
   }
}

var WordPredictModelMSGER = {
   predictNextWord: function(input)
   {
      return messageBackgroundPage("WORD_PREDICT", input)
   }
}

module.exports = {
   WordCompleteModel: WordCompleteModelMSGER,
   WordPredictModel: WordPredictModelMSGER
}
