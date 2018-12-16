const serviceabletags = require("../../../util/serviceabletags");

const FixedView = class
{
	constructor(dom)
	{
		this.dom = dom;
		this.ID = "suggestions";
		this.current_table = null;
		this.displayCount = 3;
		dom.addEventListener("keyup", this.listenForInput.bind(this));
	}

	styleTable(table)
	{
		let style = table.style;

		style.fontFamily = "arial, san-serif";
		style.borderCollapse = "collapse";
		style.width = "100%";
		style.position = "fixed";
		style.bottom = 0;
		style.textAlign = "center";
		style.zIndex = 1000;
		style.tableLayout = "fixed";
	}

	styleTableEntry(row)
	{
		let attrs =
		{
			"border": "1px solid #dddddd",
			"textAlign": "center",
			"padding": "8px",
			"height": "100"
		}

		for(let attr in attrs)
		{
			row.style[attr] = attrs[attr];
		}
	}

	createSuggestionsTable()
	{

		let sentenceRow = document.createElement("tr");
		sentenceRow.id = "sentence-display";
		let sentenceValue = document.createElement("td");
		sentenceValue.colSpan = this.displayCount;
		sentenceValue.style.textAlign = "center";
		sentenceRow.appendChild(sentenceValue);

		let table = document.createElement("table");
		table.id = "suggestion-table";
		this.styleTable(table);

		let header = document.createElement("tr");
		header.id = "suggestion-Header";
		this.styleTableEntry(header);

		let values = document.createElement("tr");
		values.id = "suggestion-values"
		this.styleTableEntry(values);

		table.appendChild(sentenceRow)
		table.appendChild(header);
		table.appendChild(values);

		//Pre-populate with null values
		for(let i = 0; i < this.displayCount; i++)
		{
			let entry = this.dom.createElement("td");
			this.styleTableEntry(entry);

			header.appendChild(entry);

			entry = this.dom.createElement("td");
			this.styleTableEntry(entry);
			values.appendChild(entry);
		}

		this.sentence = sentenceValue;
		this.current_table = table;
		this.header = header;
		this.values = values;

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

	config(options){}

	listenForInput(event)
	{
		//Grab current sentence
		if(serviceabletags.isInput(this.dom.activeElement))
		{
			this.sentence.innerText = this.dom.activeElement.value;
		}

		else if(serviceabletags.isContentEditable(this.dom.activeElement))
		{
			this.sentence.innerText = window.getSelection().anchorNode.nodeValue;
		}
	}

	display(mappings)
	{
		var dom = this.dom;

		if(this.current_table == null)
		{
			this.createSuggestionsTable();
		}

		var suggestions = Object.values(mappings);
		var shortcuts = Object.keys(mappings);

		//Populate headers
		for(let i = 0; i < this.header.children.length; i++)
		{
			let child = this.header.children[i];
			if(i < shortcuts.length)
			{
				child.innerText = shortcuts[i];
			}

			else
			{
				child.innerText = "";
			}
		}

		//Populate values
		for(let i = 0; i < this.values.children.length; i++)
		{
			let child = this.values.children[i];
			if(i < suggestions.length)
			{
				child.innerText = suggestions[i];
			}

			else
			{
				child.innerText = "";
			}
		}

		//Append the display if its not there
		if(!this.isActive())
		{
			dom.body.appendChild(this.current_table);
		}
	}
}

module.exports = FixedView;
