function exec(script)
{
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs){
        let currentTab = tabs[0];
        chrome.tabs.executeScript({
          file: script
        });
    });
}
