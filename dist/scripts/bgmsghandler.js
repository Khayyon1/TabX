chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse)
  {
    if (request.TabxOp == "WORD_COMPLETE")
    {
        sendResponse(request.TabxInput
        sendResponse({results: ["this", "is", "a", "mock"]});
    }
  });

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse)
  {
    console.log("WORD PREDICT");
    if (request.TabxOp == "WORD_PREDICT")
    {
          console.log("WORD COMPLETE");

        sendResponse({results: ["hello", "world", "goodbye"]});
    }
  });
