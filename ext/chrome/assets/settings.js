function loadSettings()
{
   let features = document.getElementById("settings")['feature'];

   chrome.storage.local.get(function(results)
   {
      currentWord = features[0];
      currentWord.checked = results["Current Word"]

      nextWord = features[1];
      nextWord.checked = results["Next Word"]
   });
}
