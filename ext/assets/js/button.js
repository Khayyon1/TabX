function sendMessageToAllTabs(msg)
{
   chrome.tabs.query({}, function(results)
         {
            console.log(results)
            for(var result in results)
            {
               chrome.tabs.sendMessage(result.id, msg);
            }
         });
}

function createButton(on)
{
   let button = document.createElement("input");
   button.type = "button";
   button.className = "activate"

   if(on)
   {
         button.value = "Turn off"
   }
   else
   {
         button.value = "Turn on"
   }

   button.addEventListener('click', function(){
      if(this.value == "Turn off")
      {
         button.value = "Turn on"
         chrome.storage.local.set({'activated': false})
         let form = document.getElementById("settings");
         form.parentNode.removeChild(form);
         sendMessageToAllTabs("enableTabX")
      }
      else
      {
         button.value = "Turn off"
         chrome.storage.local.set({'activated': true});
         createForm();
         loadSettings();
         sendMessageToAllTabs("disableTabX")

      }
   });

   document.body.appendChild(button);

}
