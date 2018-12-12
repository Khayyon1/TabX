chrome.storage.local.get('activated', function(results)
{
   var activated;
   if(results['activated'])
   {
      activated = true;
   }

   else
   {
      activated = false;
   }

   createButton(activated);

});

function createButton(on)
{
   let button = document.querySelector("li#activate");
   let text;

   if(on)
   {
       text = "Turn off"
       button.setAttribute("activated", true);
   }
   else
   {
         text = "Turn on"
         button.setAttribute("activated", false);
   }

   let node = document.createTextNode(text);
   button.querySelector("a").append(node);

   button.addEventListener('click', function(){
      if(this.getAttribute("activated") == "true")
      {
         button.querySelector("a").innerHTML = "Turn on";
         chrome.storage.local.set({'activated': false})
         sendMessageToAllTabs("disableTabX");
         button.setAttribute("activated", false);

      }

      else
      {
         button.querySelector("a").innerHTML = "Turn off";
         chrome.storage.local.set({'activated': true});
         sendMessageToAllTabs("enableTabX")
         button.setAttribute("activated", true);
      }
   });
}

document.getElementById("settings").addEventListener('click', function(e){
  chrome.windows.create({
     url: chrome.runtime.getURL("assets/settingspage/settings.html"),
     type: "popup"
  });
})
