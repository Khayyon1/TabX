chrome.runtime.onInstalled.addListener(function()
{
   chrome.storage.local.set({
      "activated": true,
      "Current Word": true,
      "Next Word": true,
      "Font": "Times New Roman",
      "Font Size": 12,
      "Font Style": "Regular",
      "Font Color": "000000",
      "Suggestions Quantity": 3,
   })
});
