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

   nextWord = document.createElement("input");
   nextWord.type = "checkbox";
   nextWord.name = "feature";
   nextWord.value = "Next Word";

   form.appendChild(p);
   form.appendChild(currentWord);
   form.appendChild(document.createTextNode("Current Word"));

   form.appendChild(nextWord);
   form.appendChild(document.createTextNode("Next Word"));

   document.body.appendChild(form);
}

chrome.storage.local.get('activated', function(results)
{
   if(results['activated'])
   {
      createForm();
   }
});

//<form id="settings">
//    <p class="popup">Select what writing assistant features you want to use</p>
//    <input type="checkbox" name="feature", value="Current Word">Current Word<br>
//    <input type="checkbox" name="feature", value="Next Word">Next Word
//</form>
