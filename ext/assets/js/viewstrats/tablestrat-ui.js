const Style = require("./style");

const TableView = class
{
    constructor(dom)
    {
        this.dom = dom;
        this.ID = "suggestions";
        this.current_table = null;
        this.style = new Style();
    }

    createSuggestionsTable(textInputBox)
    {
        let dom = this.dom;
        let table = dom.createElement("table");
        table.id = this.ID;
        table.className = "suggestions";
        let input_bounds = dom.activeElement.getBoundingClientRect();
        this.style.table(table, input_bounds, textInputBox);
        this.current_table = table;
        return table
    }

    isActive()
    {
        return this.dom.getElementById(this.ID) != null;
    }

    tearDown()
    {
        if (this.isActive())
        {
            this.current_table.parentNode.removeChild(this.current_table);
        }
    }

    display(mappings, textInputBox)
    {
        var dom = this.dom;
        var table = this.createSuggestionsTable(textInputBox);

        var suggestions = Object.values(mappings);
        var shortcuts = Object.keys(mappings);

        for (var i = 0; i < suggestions.length; i++) {
            var row = dom.createElement("tr");
            this.style.row(row);
            var shortcutColumn = dom.createElement("td");
            var suggestionsColumn = dom.createElement("td");
            shortcutColumn.appendChild(dom.createTextNode((shortcuts[i].toString())));
            suggestionsColumn.appendChild(dom.createTextNode(suggestions[i]));
            row.append(shortcutColumn);
            row.append(suggestionsColumn);
            table.appendChild(row);
        }

        dom.body.appendChild(table);
    }
}

module.exports = TableView;
