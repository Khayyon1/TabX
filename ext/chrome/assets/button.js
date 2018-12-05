let button = document.createElement("input");
button.type = "button";
button.className = "activate"

chrome.storage.local.get('activated', function(results)
{
   if(results['activated'])
   {
      button.value = "Turn off"
   }
   else
   {
      button.value = "Turn on"
   }
});

button.addEventListener('click', function(){
   if(this.value == "Turn off")
   {
      button.value = "Turn on"
      chrome.storage.local.set({'activated': false})
      let form = document.getElementById("settings");
      form.parentNode.removeChild(form);
   }
   else
   {
      button.value = "Turn off"
      chrome.storage.local.set({'activated': true});
      createForm();
   }
});

document.body.appendChild(button);
