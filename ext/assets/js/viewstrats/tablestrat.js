const TableView = class
{
    constructor(dom)
    {
        this.dom = dom;
        this.ID = "suggestions";
        this.current_table = null;
    }

    createSuggestionsTable()
    {
        let dom = this.dom;
        let table = dom.createElement("table");
        table.id = this.ID;
        table.className = "suggestions";
        table.style.position = 'absolute';

        let input_bounds = dom.activeElement.getBoundingClientRect();
        table.style.backgroundColor = "lightblue";
        table.style.zIndex = 999;
        table.style.left = (input_bounds.left).toString() + "px";
        table.style.top = (input_bounds.top + input_bounds.height).toString() + "px";

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

    display(mappings)
    {
        var dom = this.dom;
        var table = this.createSuggestionsTable();

        var suggestions = Object.values(mappings);
        var shortcuts = Object.keys(mappings);

        for (var i = 0; i < suggestions.length; i++) {
            var row = dom.createElement("tr");
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