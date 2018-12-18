function inFont()
{
   return document.getElementById("font-select");
}

function inViewStrat()
{
   return document.getElementById("view-strat-select")
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


function inSuggestionsQuantity()
{
   return document.getElementById("suggestions-quantity-select")
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

function saveSuggestionsQuantity()
{
   let val = inSuggestionsQuantity().value;
   chrome.storage.local.set({"Suggestions Quantity": val});
   reflectValue("suggestions-quantity-input", val)
   sendMessageToAllTabs("suggestionsQuantityChange");
}

function saveViewStrat()
{
   let val = inViewStrat().value;
   chrome.storage.local.set({"View Strategy": val});
   reflectValue("view-strat-input", val)
   sendMessageToAllTabs("viewStratChange");
}

inFont().addEventListener('change', saveFont);
inFontSize().addEventListener('change', saveFontSize);
inFontStyle().addEventListener('change', saveFontStyle);
inFontColor().addEventListener('change', saveFontColor);
inSuggestionsQuantity().addEventListener('change', saveSuggestionsQuantity);
inViewStrat().addEventListener('change', saveViewStrat)

//Load the settings
chrome.storage.local.get(function(results)
{
   reflectValue("font-input", results["Font"])
   reflectValue("font-color-input", results["Font Color"])
   reflectValue("font-size-input", results["Font Size"])
   reflectValue("font-style-input", results["Font Style"])
   reflectValue("suggestions-quantity-input", results["Suggestions Quantity"])
   reflectValue("view-strat-input", results["View Strategy"])
});

var coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++)
{
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
