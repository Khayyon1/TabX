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

    createSuggestionsTable()
    {
        let dom = this.dom;
        let table = dom.createElement("table");
        table.id = this.ID;
        table.className = "suggestions";
        this.style.table(table, dom.activeElement);
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
        this.style.updatePosition(table);
    }
    config(settings){
        this.style.settings = settings;
    }
    
}

module.exports = TableView;
