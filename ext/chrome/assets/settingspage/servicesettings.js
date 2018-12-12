function getCurrentWordCBox()
{
   return document.getElementById("current word");
}

function getNextWordCBox()
{
   return document.getElementById("next word");
}

function saveCurrentWordSettings()
{
   save.bind(this)();
   console.log("save after current word " + this.checked);

   if(this.checked)
   {
      sendMessageToAllTabs("enableWordCompletion");
   }
   else
   {
      sendMessageToAllTabs("disableWordCompletion");
   }
}

function saveNextWordSettings()
{
   save.bind(this)();
   if(this.checked)
   {
      sendMessageToAllTabs("enableWordPrediction");
   }
   else
   {
      sendMessageToAllTabs("disableWordPrediction");
   }
}

function save()
{
   data = {};
   console.log(this.toString() + this.checked);
   data[this.value] = this.checked;
   chrome.storage.local.set(data);
}

function checkCurrentWord(bool)
{
   getCurrentWordCBox().checked = bool;
}


function checkNextWord(bool)
{
   getNextWordCBox().checked = bool;
}


getCurrentWordCBox().addEventListener('change', saveCurrentWordSettings);
getNextWordCBox().addEventListener('change', saveNextWordSettings);

chrome.storage.local.get(function(results)
{
   checkCurrentWord(results['Current Word']);
   checkNextWord(results['Next Word']);
})
