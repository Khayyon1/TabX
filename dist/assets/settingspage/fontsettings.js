function inFont()
{
   return document.getElementById("font-select");
}

function inFontSize()
{
   return document.getElementById("font-size-select");
}

function inFontStyle()
{
   return document.getElementById("font-style-select");
}

function inFontColor()
{
   return document.getElementById("font-color-input")
}

function reflectValue(id, val)
{
   document.getElementById(id).value = val;
}

function saveFont()
{
   let val = inFont().value
   chrome.storage.local.set({"Font": val});
   reflectValue("font-input", val)
   sendMessageToAllTabs("updateDisplay");
}

function saveFontSize()
{
   let val = inFontSize().value
   chrome.storage.local.set({"Font Size": val});
   reflectValue("font-size-input", val)
   sendMessageToAllTabs("updateDisplay");
}

function saveFontStyle()
{
   let val = inFontStyle().value
   chrome.storage.local.set({"Font Style": inFontStyle().value});
   reflectValue("font-style-input", val)
   sendMessageToAllTabs("updateDisplay");
}

function saveFontColor()
{
   let val = inFontColor().value;
   chrome.storage.local.set({"Font Color": val});
   reflectValue("font-color-input", val)
   sendMessageToAllTabs("updateDisplay");
}

inFont().addEventListener('change', saveFont);
inFontSize().addEventListener('change', saveFontSize);
inFontStyle().addEventListener('change', saveFontStyle);
inFontColor().addEventListener('change', saveFontColor);

//Load the settings
chrome.storage.local.get(function(results)
{
   reflectValue("font-input", results["Font"])
   reflectValue("font-color-input", results["Font Color"])
   reflectValue("font-size-input", results["Font Size"])
   reflectValue("font-style-input", results["Font Style"])
});
