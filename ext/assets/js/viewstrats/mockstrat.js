var ID = "suggestions"
var current = null;

function isActive()
{
   return document.getElementById(ID) != null;
}

function tearDown()
{
   if(isActive())
   {
       current.parentNode.removeChild(current);
   }
}

function display(mappings)
{
    tearDown();
   current = document.createElement("p");
   var suggestions = Object.values(mappings);
   var shortcuts = Object.keys(mappings);

   for(var i = 0; i < suggestions.length; i++)
   {
       let text = document.createTextNode(shortcuts[i] + " " + suggestions[i]);
       current.appendChild(text);
   }

   document.body.appendChild(current);

}

module.exports = {
    isActive: isActive,
    tearDown: tearDown,
    display: display
}
