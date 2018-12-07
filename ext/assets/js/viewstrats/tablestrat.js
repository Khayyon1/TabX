var ID = "suggestions"

function createSuggestionsTable()
{
    var table = document.createElement("table");
    table.id = ID;
    table.className = "suggestions";
    table.style.position = 'absolute';
    var input_bounds = document.activeElement.getBoundingClientRect();
    table.style.backgroundColor = "lightblue";
    table.style.zIndex = 999;
    table.style.left = (input_bounds.left).toString() + "px";
    table.style.top = (input_bounds.top + input_bounds.height).toString()+"px";
    return table
}

function isActive()
{
   return document.getElementById(ID) != null;
}

function tearDown()
{
   if(isActive)
   {
      document.body.removeChild(current_table);
   }
}

function display(suggestions, shortcuts)
{
   var table = createSuggestionsTable();

   var suggestions = getAppropriateSuggestions();

   for(var i = 0; i < suggestions.length; i++)
   {
       var row = document.createElement("tr");
       var column1 = document.createElement("td");
       var column2 = document.createElement("td");
       column1.appendChild(document.createTextNode(((i + 1).toString())));
       column2.appendChild(document.createTextNode(suggestions[i]));
       row.append(column1);
       row.append(column2);
       table.appendChild(row);
   }

   document.body.appendChild(table);

}
