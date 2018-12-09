function createForm()
{
   p = document.createElement("p");
   p.className = "popup"
   ptxt = document.createTextNode("Select what writing assistant"  +
   " features you want to use")
   p.appendChild(ptxt);

   form = document.createElement("form");
   form.id = "settings"


   currentWord = document.createElement("input");
   currentWord.type = "checkbox";
   currentWord.name = "feature";
   currentWord.value = "Current Word";
   currentWord.addEventListener('change', function()
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
   });

   nextWord = document.createElement("input");
   nextWord.type = "checkbox";
   nextWord.name = "feature";
   nextWord.value = "Next Word";

   nextWord.addEventListener('change',function()
   {
      save.bind(this)();
      console.log("save after next word" + this.checked);
      if(this.checked)
      {
         sendMessageToAllTabs("enableWordPrediction");
      }
      else
      {
         sendMessageToAllTabs("disableWordPrediction");
      }
   })
   form.appendChild(p);
   form.appendChild(currentWord);
   form.appendChild(document.createTextNode("Current Word"));

   form.appendChild(nextWord);
   form.appendChild(document.createTextNode("Next Word"));

   document.body.appendChild(form);
}

function save()
{
   data = {};
   console.log(this.toString() + this.checked);
   data[this.value] = this.checked;
   chrome.storage.local.set(data);
}


//<form id="settings">
//    <p class="popup">Select what writing assistant features you want to use</p>
//    <input type="checkbox" name="feature", value="Current Word">Current Word<br>
//    <input type="checkbox" name="feature", value="Next Word">Next Word
//</form>
