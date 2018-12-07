var ID = "suggestions"
var current_table = null;

function createSuggestionsTable()
{
    let table = document.createElement("table");
    table.id = ID;
    table.className = "suggestions";
    table.style.position = 'absolute';

    let input_bounds = document.activeElement.getBoundingClientRect();
    table.style.backgroundColor = "lightblue";
    table.style.zIndex = 999;
    table.style.left = (input_bounds.left).toString() + "px";
    table.style.top = (input_bounds.top + input_bounds.height).toString()+"px";

    current_table = table;
    return table
}

function isActive()
{
   return document.getElementById(ID) != null;
}

function tearDown()
{
   if(isActive())
   {
       current_table.parentNode.removeChild(current_table);
   }
}

function display(mappings)
{
   var table = createSuggestionsTable();

   var suggestions = Object.values(mappings);
   var shortcuts = Object.keys(mappings);

   for(var i = 0; i < suggestions.length; i++)
   {
       var row = document.createElement("tr");
       var shortcutColumn = document.createElement("td");
       var suggestionsColumn = document.createElement("td");
       shortcutColumn.appendChild(document.createTextNode((shortcuts[i].toString())));
       suggestionsColumn.appendChild(document.createTextNode(suggestions[i]));
       row.append(shortcutColumn);
       row.append(suggestionsColumn);
       table.appendChild(row);
   }

   document.body.appendChild(table);

}

module.exports = {
    isActive: isActive,
    tearDown: tearDown,
    display: display
}
