const Style = require("./style");

/** Class for displaying dynamically moving TabX table
 *  based on caret position
 */
const TableView = class
{
    /**
     * Constructor
     * @param {HTMLDom} dom - dom TabX table will be attached to
     */
    constructor(dom)
    {
        this.dom = dom;
        this.ID = "suggestions";
        this.current_table = null;
        this.style = new Style();
    }

    /**
     * Creates TabX table
     */
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

    /**
     * Checks whether an element is active
     */
    isActive()
    {
        return this.dom.getElementById(this.ID) != null;
    }

    /**
     * Removes TabX table
     */
    tearDown()
    {
        if (this.isActive())
        {
            this.current_table.parentNode.removeChild(this.current_table);
        }
    }

    /**
     * Creates and presents TabX table
     * @param {array} mappings - predictions from backend
     */
    display(mappings)
    {
      this.tearDown();
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
            suggestionsColumn.appendChild(dom.createTextNode('| '+suggestions[i]));
            row.append(shortcutColumn);
            row.append(suggestionsColumn);
            table.appendChild(row);
        }

        dom.body.appendChild(table);
        this.style.updatePosition(table);
    }

    /**
     * Updates style settings (color, font, etc.)
     * @param {object} settings 
     */
    config(settings){
        this.style.settings = settings;
    }

}

module.exports = TableView;
