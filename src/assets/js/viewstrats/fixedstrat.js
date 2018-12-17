const serviceabletags = require("../../../util/serviceabletags");

const FixedView = class
{
	constructor(dom)
	{
		this.dom = dom;
		this.ID = "tabx-fixedstrat-suggestionstable";
		this.displayCount = 3;
		dom.addEventListener("keyup", this.listenForInput.bind(this));
		this.createSuggestionsTable();
	}

	styleTable(table)
	{
		let style = table.style;

		style.fontFamily = "arial, san-serif";
		style.borderCollapse = "collapse";
		style.width = "100%";
		style.position = "fixed";
		style.bottom = 0;
		style.left = 0;
		style.textAlign = "center";
		style.zIndex = 1000;
		style.tableLayout = "fixed";
		style.backgroundColor = "#898989";

	}

	styleTableEntry(row)
	{
		//Attributes
		let attrs =
		{
			"border": "2px solid #dddddd",
			"textAlign": "center",
			"padding": "4px",
			"backgroundColor": "#cccccc",
			"height": "100",
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
		sentenceValue.style.color = "white"
		sentenceRow.appendChild(sentenceValue);

		let table = document.createElement("table");
		table.id = this.ID
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
		console.log("Display Count: "+ this.displayCount);
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
		return this.dom.getElementById(this.ID) !== null;
	}

	tearDown()
	{
		console.log("ACTIVE: " + this.isActive());
		if (this.isActive())
		{
			this.current_table.parentNode.removeChild(this.current_table);
		}
	}

	config(options)
	{
		for(let elem of [this.header, this.values])
		{
			elem.style.color       = options["fontcolor"];
			elem.style.fontSize    = options["fontsize"] + "px";
			elem.style.fontFamily  = options["font"];
			elem.style.fontStyle   = options["fontstyle"];
		}

	}

	listenForInput(event)
	{
		//Grab current sentence
		if(serviceabletags.isInput(this.dom.activeElement))
		{
			let text = this.dom.activeElement.value;
			let start = this.dom.activeElement.selectionStart;
			text = text.slice(0, start) + "|" + text.slice(start);
			this.sentence.innerText = text;
		}

		else if(serviceabletags.isContentEditable(this.dom.activeElement))
		{
			let selection = window.getSelection();
			let text = selection.anchorNode.nodeValue;
			text = text.slice(0, selection.anchorOffset) + "|" + text.slice(selection.anchorOffset);
			this.sentence.innerText = text;
		}
	}
	setSuggestionsDisplayCount(count)
	{
		this.displayCount = count;
		this.tearDown();
		this.createSuggestionsTable();
	}
	display(mappings)
	{
		const dom = this.dom;

		if(this.current_table == null)
		{
			this.createSuggestionsTable();
		}

		let suggestions = Object.values(mappings);
		let shortcuts = Object.keys(mappings);

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
