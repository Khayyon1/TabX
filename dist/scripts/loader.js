chrome.tabs.onUpdated.addListener(loadTabX)

function loadTabX(tabId, changeInfo, tab)
{
    if(changeInfo.status == 'complete' && tab.active)
    {
        loadTabXIfActivated()
    }
}

function exec(script)
{
    chrome.tabs.getSelected(null, function (tab){
        chrome.tabs.executeScript(tab.id, {
          file: script
        });
    });
}

function loadTabXIfActivated()
{
    chrome.storage.local.get('activated', results => {
        if(results['activated'])
        {
            exec('./scripts/tabx.js');
        }});
}