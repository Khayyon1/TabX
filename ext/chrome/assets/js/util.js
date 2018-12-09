function sendMessageToAllTabs(msg)
{
   chrome.tabs.query({}, function(tabs)
         {
            console.log(tabs)
            for(let tab in tabs)
            {
               chrome.tabs.sendMessage(tabs[tab].id, msg);
            }
         });
}