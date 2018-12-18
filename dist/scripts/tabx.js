/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const TabX = __webpack_require__(1);
const FixedView = __webpack_require__(3);
const TableView = __webpack_require__(5);
const applySettings = __webpack_require__(6);
const bgmodels = __webpack_require__(8);
//const profanityfilter = require("./models/profanityfilter/profanity-filter");

//const mocknext = require("./models/mock/nextword_mock")
//const mockcomp = require("./models/mock/wordcomplete_mock")

let fixedDisplay = new FixedView(document);
let tableDisplay = new TableView(document);

let tabx = new TabX(bgmodels.WordCompleteModel,
   bgmodels.WordPredictModel,
   fixedDisplay,
   document=document);

applySettings(tabx);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// TabX Shortcuts

var serviceabletags = __webpack_require__(2);
var _current_word = "";

//import {wordCompleteModel} from './models/wordcomplete.js';
var _debug = false;

const TabX = class
{
    constructor(wordCompleteModel,
                wordPredictModel,
                displayStrategy,
                document=document,
                filter={"filter": (str) => str},
                wordCompleteEnabled=true,
                wordPredictEnabled=true)

    {
        this.wordCompleteModel = wordCompleteModel;
        this.wordPredictModel = wordPredictModel;
        this.displayStrategy = displayStrategy;
        this.shortcuts = ["1", "2", "3"];
        this.document = document;
        this.wordPredictEnabled = wordPredictEnabled;
        this.wordCompleteEnabled = wordCompleteEnabled;
        this.enabled = true;
        this.suggestionsDisplayCount = 3;
        this.filter = filter;
        this.registerListeners();
        this.tabCount = -1;
    }

    setDocument(document)
    {
        this.document = document;
    }

    async getAppropriateSuggestions()
    {
        var elem = this.document.activeElement
        var caret;
        var previous;
        var charAtCaret;
        var text;

        if(serviceabletags.isInput(elem))
        {
            caret = elem.selectionStart;
            text = elem.value;
            previous = text.charAt(caret - 1);
            charAtCaret = text.charAt(caret);
        }

        else if(serviceabletags.isContentEditable(elem))
        {
            let info = serviceabletags.caretAndTextOfEditableDiv(elem, window.getSelection().baseNode);
            caret = info["caret"];
            text = info["text"];
            previous = info["text"].charAt(caret - 1);
            charAtCaret = info["text"].charAt(caret);
        }

        else
        {
            throw new Error("Active element not serviceable");
        }

        text = this.filter.filter(text);

        let currentWord = this.getCurrentWord(text, caret);
        //Check for whether we can do word prediction

        var charBeforeCaret = /\S/.test(previous);
        if(charBeforeCaret && this.wordCompleteEnabled)
        {
            return await this.getSuggestions(currentWord);
        }

        charAtCaret = /\S/.test(charAtCaret);

        if(!this.inputIsNotValid(currentWord)
            && !charBeforeCaret
            && !charAtCaret
            && this.wordPredictEnabled)
        {
            return await this.getNextWordSuggestion(text.trim().substring(0, caret));
        }
    }

    async displaySuggestions()
    {
        if(this.tabCount !== -1)
        {
            return;
        }

        if(!serviceabletags.activeElementIsServiceable()
            ||
            this.document.activeElement.value == "")
        {
            this.displayStrategy.tearDown();
            return;
        }

        let suggestions = await this.getAppropriateSuggestions();

        if(suggestions == undefined || suggestions.length == 0)
        {
            this.displayStrategy.tearDown();
            return;
        }

        //Don't get new suggestions if the user used tab-select
        if(this.tabCount === -1)
        {
            suggestions = suggestions.slice(0, this.suggestionsDisplayCount);
            this.mappings = {};
            for(let i = 0; i < suggestions.length; i++)
            {
                let shortcut = this.shortcuts[i];
                let suggestion = suggestions[i];

                //Every shortcut is mapped to a suggestion that TabX can reference
                //later
                this.mappings[shortcut] = suggestion;
            }
        }

        this.displayStrategy.display(this.mappings);
    }

    wordCompletion(userChoice)
    {
        let activeElement = document.activeElement;

        if("value" in activeElement)
        {
            let prevStart = activeElement.selectionStart;
            let offset;

            //if predicting next word
            if(/\s/.test(activeElement.value.charAt(prevStart - 1)))
            {
                offset = 0;
            }
            else
            {
                offset = this.getCurrentWord(activeElement.value, prevStart).length;
            }

            activeElement.value = this.replaceWordAt(
                activeElement.value,
                activeElement.selectionStart,
                userChoice);

            let caret = prevStart + (userChoice.length - offset);

            activeElement.setSelectionRange(caret, caret);

        }

        else if("nodeValue" in activeElement)
        {
            let selection = window.getSelection();
            let target = selection.anchorNode;
            let caret = serviceabletags.caretAndTextOfEditableDiv(
                activeElement, target)["caret"];

            let start = selection.anchorOffset;
            let isPredictingNextWord = /\s/.test(target.
            nodeValue.charAt(start - 1));

            let offset = this.getCurrentWord(target.
                nodeValue, start).length;

            target.nodeValue = this.replaceWordAt(
                target.nodeValue.replace(/\u00a0/g, " "), //Replace hard spaces
                start,
                userChoice);

            //Set the caret back to expected position
            if(isPredictingNextWord)
            {
                offset = 0;
            }

            selection.collapse(target, start + (userChoice.length -
                offset));
        }

        else
        {
            throw new Error("Attempted to mutate element" +
                "that does not handle text")
        }
    }

    replaceWordAt(str, i, word, delimiter=' ')
    {
        let startOfWord = str.lastIndexOf(delimiter, i - 1);

        let before = str.substring(0, startOfWord);
        if (before !== "" && before != null)
        {
            before += " "
        }

        let after  = str.substring(i);

        if(after.charAt(0) !== "" && after.charAt(0) !== " ")
        {
            after = " " + after;
        }

        return before + word + after;
    }

    getCurrentWord(text, caret)
    {
        if(caret === 0)
        {
            return "";
        }

        //Check to see if the previoius character is a whitespace
        //If it is not, push previous back one to allow the current
        //word be the word that comes before a whitespace
        //Ex. "hello |" -> "hello"
        let offset = 1;
        var prev = text.charAt(caret - offset);
        while(prev.match(/\s/))
        {
            offset += 1;
            prev = text.charAt(caret - offset);
        }

        //off by one due to while loop
        caret -= (offset - 1);

        //Make sure caret is at the end of a developing word
        if(prev.match(/\w/))
        {
            //Iterate backwards to find the first instance of a white space
            // 0 to caret
            var startOfWord = this.indexOfStartOfCurrentWord(text,
                caret);

            if(startOfWord === 0)
            {
                return text.substring(0, caret);
            }
            else
            {
                return text.substring(startOfWord, caret);
            }
        }

        else
        {
            return "";
        }
    }

    indexOfStartOfCurrentWord(text, caret)
    {
        //Iterate backwards to find the first instance of a white space
        var i = caret;
        while(i > 0 && text.charAt(i - 1).match(/\w/))
        {
            i--;
        }

        return i;
    }

    inputHasCharactersOtherThanLetters(string)
    {
        return (/[^a-zA-Z\s]/).test(string)
    }

    inputIsNotValid(str)
    {
        return this.inputHasCharactersOtherThanLetters(str)
            ||
            str.length == 0;
    }

    async getSuggestions(incomplete_string)
    {
        if(this.inputIsNotValid(incomplete_string))
        {
            return [];
        }

        let results = this.wordCompleteModel.predictCurrentWord(
            incomplete_string);

        if(typeof(results) === Promise)
        {
            return await results;
        }

        return results;
    }

    async getNextWordSuggestion(str)
    {
        let results = this.wordPredictModel.predictNextWord(str);
        if(typeof(results) === Promise)
        {
            return await results;
        }

        else
        {
            return results;
        }
    }

    handleUserInput(event)
    {

        if (serviceabletags.activeElementIsServiceable()
            && this.enabled)
        {
            this.displaySuggestions();
        }
    }

    handleWordComplete(event)
    {
        if(!this.enable){return;}

        var keyname = event.key;

        if(serviceabletags.activeElementIsServiceable())
        {
            let userChoice;
            if (keyname == 'Tab' && this.displayStrategy.isActive())
            {
                event.preventDefault();
                this.tabCount = (this.tabCount + 1) % Object.keys(this.mappings).length;
                userChoice = this.mappings[this.shortcuts[this.tabCount]];
            }

            else if(this.shortcuts.includes(keyname))
            {
                this.tabCount = -1;
                event.preventDefault();
                userChoice = this.mappings[keyname];
            }

            else
            {
                this.tabCount = -1;
            }

            if (userChoice)
            {
                this.wordCompletion(userChoice);
            }
        }

        else
        {
            this.tabCount = -1;
        }
    }

    registerListeners()
    {
        //Provide suggestions based on developing word
        this.document.addEventListener('keydown',
            this.handleWordComplete.bind(this));

        //Shows suggestions
        this.document.addEventListener('keyup',
            this.handleUserInput.bind(this));

        var serviceableElements = serviceabletags.
        getServicableElements();

        //Listens for when active elements lose focus
        for(var i = 0; i < serviceableElements.length; i++)
        {
            var elem = serviceableElements[i];
            elem.addEventListener('blur', function()
            {
                this.displayStrategy.tearDown();
            }.bind(this));
        };

    }

    enable()
    {
        this.enabled = true;
    }

    disable()
    {
        this.enabled = false
    }

    disableWordPrediction()
    {
        this.wordPredictEnabled = false;
    }

    disableWordCompletion()
    {
        this.wordCompleteEnabled = false;
    }

    enableWordPrediction()
    {
        this.wordPredictEnabled = true;
    }

    enableWordCompletion()
    {
        this.wordCompleteEnabled = true;
    }

    configureDisplay(settings)
    {
      console.log(settings);
        this.displayStrategy.config(settings);
    }

    setSuggestionsDisplayCount(count)
    {
        this.suggestionsDisplayCount = count;
        let newShortcuts = [];
        for(let i = 1; i <= count; i++)
        {
            newShortcuts.push(i.toString());
        }
        this.shortcuts = newShortcuts;

        this.displayStrategy.setSuggestionsDisplayCount(count);
    }
};

module.exports = TabX;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

var selector = 'input[type=text], textarea, [contenteditable=true], [contenteditable]';

var serviceableTags = [
   "input[type=text]",
   'textarea',
   "[contenteditable=true]",
   "[contenteditable]"
]

var input = [
   "input[type=text]",
   'textarea'
]

var contenteditable = [
   "[contenteditable=true]",
   "[contenteditable]"
]

function getServicableElements()
{
   return document.querySelectorAll(selector);
}

function activeElementIsServiceable()
{
   let activeElement = document.activeElement;
   for(let i = 0; i < serviceableTags.length; i++)
   {
      if(activeElement.matches(serviceableTags[i]))
      {
         return true;
      }
   }

   return false;
}

function isInput(tag)
{
   for(let matcher of input)
   {
      if(tag.matches(matcher))
      {
         return true;
      }
   }

   return false;
}

function isContentEditable(tag)
{
      for(let matcher of contenteditable)
      {
         if(tag.matches(matcher))
         {
            return true;
         }
      }

   return false;
}


function caretAndTextOfEditableDiv(parentEditableDiv, targetDiv)
{
   if(parentEditableDiv == targetDiv)
   {
      return window.getSelection().anchorOffset;
   }

   let texts = getTextUpToChildInEditableDiv(parentEditableDiv, targetDiv)
   let base = texts[0];
   let activeElementText = texts[1];
   let offset = window.getSelection().anchorOffset;
   let caret = (base.length + offset)
   let stringUpToCaret = activeElementText.substr(0, offset)

   return { "text": base + stringUpToCaret, "caret": caret };
}

function getTextUpToChildInEditableDiv(root, target)
{
   let cur = target;
   let activeNodeText = target.textContent;
   let text = ""
   while(cur != root)
   {
      while(cur.previousSibling != null)
      {
         cur = cur.previousSibling;
         text = cur.textContent + text;
         if(["P", "DIV"].includes(cur.tagName))
         {
            text = " " + text;
         }
      }

      //Edge case if the parent node is a div or p tag.
      //since the text associated with the parent is one
      //of its child nodes.
      cur = cur.parentNode;
      if(["P", "DIV"].includes(cur.tagName))
      {
         text = " " + text;
      }
   }

   return [text, activeNodeText];
}

module.exports =
{
   isInput: isInput,
   isContentEditable: isContentEditable,
   getServicableElements: getServicableElements,
   activeElementIsServiceable: activeElementIsServiceable,
   caretAndTextOfEditableDiv: caretAndTextOfEditableDiv,
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const serviceabletags = __webpack_require__(2);

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

			console.log("FONT STYLE: " + options["fontstyle"]);
			if(options["fontstyle"] === "Bold")
			{
				elem.style.fontWeight = "bold";
			}
			else
			{
				elem.style.fontWeight = "normal";
				elem.style.fontStyle  = options["fontstyle"];
			}
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const position = __webpack_require__(7).position;

const Style = class
{
    constructor(){
        this.cache = {};
        this.offset_y = 0;
    }
    table(element, textInputBox)
    {
        element.style.display = 'flex';
        element.style.position = 'absolute';
        element.style.backgroundColor = "lightgrey";
        element.style.zIndex = 999;

        const rect = textInputBox.getBoundingClientRect();
        const caret = position(textInputBox);
        this.offset_y = window.getComputedStyle(textInputBox, "").fontSize;
        this.offset_y = this.pxToInt(this.offset_y) - textInputBox.scrollTop;
        element.style.top = (rect.top + caret.top + this.offset_y).toString() + 'px';
        element.style.left = (rect.left + caret.left).toString() + 'px';
    }

    updatePosition(element)
    {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const elRect = element.getBoundingClientRect();
        const left = this.pxToInt(element.style.left);
        const top = this.pxToInt(element.style.top);

        // console.log('Mishiii', w, elRect.right)
        // console.log(elRect)

        if (elRect.right > w) {
            const offset_x = elRect.right - w;
            element.style.left = (left - offset_x).toString() + 'px'
        }

        if (elRect.bottom > h){
            const offset_y = 2*this.offset_y + parseInt(this.settings.fontsize);
            element.style.top = (top - offset_y).toString() + 'px'
        }

    }
    pxToInt(px){
        return parseInt(px.slice(0, px.length - 2))
    }
    row(element, offset=6)
    {
        element.style.marginRight = offset.toString() + 'px';
        if (this.settings){
            element.style.fontFamily = this.settings.font;
            element.style.fontSize = this.settings.fontsize+"px";
            element.style.color = this.settings.fontcolor;
            element.style.fontWeight = this.settings.fontstyle.toLowerCase();
        }
    }
    calcSize(text, options = {}) {

        const cacheKey = JSON.stringify({ text: text, options: options })

        if (this.cache[cacheKey]) {
            return this.cache[cacheKey]
        }

        // prepare options
        options.font = options.font || 'Times'
        options.fontSize = options.fontSize || '16px'
        options.fontWeight = options.fontWeight || 'normal'
        options.lineHeight = options.lineHeight || 'normal'
        options.width = options.width || 'auto'
        options.wordBreak = options.wordBreak || 'normal'

        const element = this.createDummyElement(text, options)

        const size = {
            width: element.offsetWidth,
            height: element.offsetHeight,
        }

        this.destroyElement(element)

        this.cache[cacheKey] = size

        return size
    }
    
    destroyElement(element)
    {
        element.parentNode.removeChild(element)
    }

    createDummyElement(text, options) {
        const element = document.createElement('div')
        const textNode = document.createTextNode(text)

        element.appendChild(textNode)

        element.style.fontFamily = options.font
        element.style.fontSize = options.fontSize
        element.style.fontWeight = options.fontWeight
        element.style.lineHeight = options.lineHeight
        element.style.position = 'absolute'
        element.style.visibility = 'hidden'
        element.style.left = '-999px'
        element.style.top = '-999px'
        element.style.width = options.width
        element.style.height = 'auto'
        element.style.wordBreak = options.wordBreak

        document.body.appendChild(element)

        return element
    }
}

module.exports = Style;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Style = __webpack_require__(4);

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


/***/ }),
/* 6 */
/***/ (function(module, exports) {

function applySettings(tabx)
{
   chrome.storage.local.get(function (results)
   {
      if (results != null)
      {
         if (!results['activated'])
         {
            tabx.disable();
         }

         if(!results["Current Word"])
         {
            tabx.disableWordCompletion();
         }

         if(!results["Next Word"])
         {
            tabx.disableWordPrediction();
         }

         let config =
         {
            font: results["Font"],
            fontsize: results["Font Size"],
            fontstyle: results["Font Style"],
            fontcolor: results["Font Color"]
         };

         tabx.configureDisplay(config);

         if(results["Suggestions Quantity"])
         {
            tabx.setSuggestionsDisplayCount(results["Suggestions Quantity"]);
         }

         listenForSettingChanges(tabx);

      }
   })
};

var actions =
{
   "enableTabX": (tabx) => { tabx.enable() },
   "disableTabX": (tabx) => { tabx.disable() },
   "enableWordCompletion": (tabx) => { tabx.enableWordCompletion() },
   "enableWordPrediction": (tabx) => { tabx.enableWordPrediction() },
   "disableWordCompletion": (tabx) => { tabx.disableWordCompletion() },
   "disableWordPrediction": (tabx) => { tabx.disableWordPrediction() },
   "updateDisplay": (tabx) =>
   {
      chrome.storage.local.get(function(results)
      {
         let config =
         {
            font: results["Font"],
            fontsize: results["Font Size"],
            fontstyle: results["Font Style"],
            fontcolor: results["Font Color"]
         };

         tabx.configureDisplay(config);
      });
   },

   "suggestionsQuantityChange": (tabx) =>
   {
      chrome.storage.local.get(function(results)
      {
         let quantity = results["Suggestions Quantity"];
         if(!quantity || quantity === 0)
         {
            quantity = 3;
         }

         tabx.setSuggestionsDisplayCount(quantity);

      });
   }
}

function listenForSettingChanges(tabx)
{
   chrome.runtime.onMessage.addListener(function(message, sender, sendResponse)
   {
      console.log("received message: " + message);
      let action = actions[message];
      action(tabx);
   });
}

module.exports = applySettings


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "position", function() { return position; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "offset", function() { return offset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOffset", function() { return getOffset; });
var attributes = ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderTopWidth', 'boxSizing', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'letterSpacing', 'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'outlineWidth', 'overflow', 'overflowX', 'overflowY', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'textAlign', 'textOverflow', 'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap'];

/**
 * Create a mirror
 *
 * @param {Element} element The element
 * @param {string} html The html
 *
 * @return {object} The mirror object
 */
var createMirror = function createMirror(element, html) {

  /**
   * The mirror element
   */
  var mirror = document.createElement('div');

  /**
   * Create the CSS for the mirror object
   *
   * @return {object} The style object
   */
  var mirrorCss = function mirrorCss() {
    var css = {
      position: 'absolute',
      left: -9999,
      top: 0,
      zIndex: -2000
    };

    if (element.tagName === 'TEXTAREA') {
      attributes.push('width');
    }

    attributes.forEach(function (attr) {
      css[attr] = getComputedStyle(element)[attr];
    });

    return css;
  };

  /**
   * Initialize the mirror
   *
   * @param {string} html The html
   *
   * @return {void}
   */
  var initialize = function initialize(html) {
    var styles = mirrorCss();
    Object.keys(styles).forEach(function (key) {
      mirror.style[key] = styles[key];
    });
    mirror.innerHTML = html;
    element.parentNode.insertBefore(mirror, element.nextSibling);
  };

  /**
   * Get the rect
   *
   * @return {Rect} The bounding rect
   */
  var rect = function rect() {
    var marker = mirror.ownerDocument.getElementById('caret-position-marker');
    var boundingRect = {
      left: marker.offsetLeft,
      top: marker.offsetTop,
      height: marker.offsetHeight
    };
    mirror.parentNode.removeChild(mirror);

    return boundingRect;
  };

  initialize(html);

  return {
    rect: rect
  };
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

/**
 * Check if a DOM Element is content editable
 *
 * @param {Element} element  The DOM element
 *
 * @return {bool} If it is content editable
 */
var isContentEditable = function isContentEditable(element) {
  return !!(element.contentEditable && element.contentEditable === 'true');
};

/**
 * Get the context from settings passed in
 *
 * @param {object} settings The settings object
 *
 * @return {object} window and document
 */
var getContext = function getContext() {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var customPos = settings.customPos,
      iframe = settings.iframe,
      noShadowCaret = settings.noShadowCaret;

  if (iframe) {
    return {
      iframe: iframe,
      window: iframe.contentWindow,
      document: iframe.contentDocument || iframe.contentWindow.document,
      noShadowCaret: noShadowCaret,
      customPos: customPos
    };
  }

  return {
    window: window,
    document: document,
    noShadowCaret: noShadowCaret,
    customPos: customPos
  };
};

/**
 * Get the offset of an element
 *
 * @param {Element} element The DOM element
 * @param {object} ctx The context
 *
 * @return {object} top and left
 */
var getOffset = function getOffset(element, ctx) {
  var win = ctx && ctx.window || window;
  var doc = ctx && ctx.document || document;
  var rect = element.getBoundingClientRect();
  var docEl = doc.documentElement;
  var scrollLeft = win.pageXOffset || docEl.scrollLeft;
  var scrollTop = win.pageYOffset || docEl.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};

/**
 * Check if a value is an object
 *
 * @param {any} value The value to check
 *
 * @return {bool} If it is an object
 */
var isObject = function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
};

/**
 * Create a Input caret object.
 *
 * @param {Element} element The element
 * @param {Object} ctx The context
 */
var createInputCaret = function createInputCaret(element, ctx) {

  /**
   * Get the current position
   *
   * @returns {int} The caret position
   */
  var getPos = function getPos() {
    return element.selectionStart;
  };

  /**
   * Set the position
   *
   * @param {int} pos The position
   *
   * @return {Element} The element
   */
  var setPos = function setPos(pos) {
    element.setSelectionRange(pos, pos);

    return element;
  };

  /**
   * The offset
   *
   * @param {int} pos The position
   *
   * @return {object} The offset
   */
  var getOffset$$1 = function getOffset$$1(pos) {
    var rect = getOffset(element);
    var position = getPosition(pos);

    return {
      top: rect.top + position.top + ctx.document.body.scrollTop,
      left: rect.left + position.left + ctx.document.body.scrollLeft,
      height: position.height
    };
  };

  /**
   * Get the current position
   *
   * @param {int} pos The position
   *
   * @return {object} The position
   */
  var getPosition = function getPosition(pos) {
    var format = function format(val) {
      var value = val.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, '<br/>');
      return value;
    };

    if (ctx.customPos || ctx.customPos === 0) {
      pos = ctx.customPos;
    }

    var position = pos === undefined ? getPos() : pos;
    var startRange = element.value.slice(0, position);
    var endRange = element.value.slice(position);
    var html = '<span style="position: relative; display: inline;">' + format(startRange) + '</span>';
    html += '<span id="caret-position-marker" style="position: relative; display: inline;">|</span>';
    html += '<span style="position: relative; display: inline;">' + format(endRange) + '</span>';

    var mirror = createMirror(element, html);
    var rect = mirror.rect();
    rect.pos = getPos();

    return rect;
  };

  return {
    getPos: getPos,
    setPos: setPos,
    getOffset: getOffset$$1,
    getPosition: getPosition
  };
};

/**
 * Create an Editable Caret
 * @param {Element} element The editable element
 * @param {object|null} ctx The context
 *
 * @return {EditableCaret}
 */
var createEditableCaret = function createEditableCaret(element, ctx) {

  /**
   * Set the caret position
   *
   * @param {int} pos The position to se
   *
   * @return {Element} The element
   */
  var setPos = function setPos(pos) {
    var sel = ctx.window.getSelection();
    if (sel) {
      var offset = 0;
      var found = false;
      var find = function find(position, parent) {
        for (var i = 0; i < parent.childNodes.length; i++) {
          var node = parent.childNodes[i];
          if (found) {
            break;
          }
          if (node.nodeType === 3) {
            if (offset + node.length >= position) {
              found = true;
              var range = ctx.document.createRange();
              range.setStart(node, position - offset);
              sel.removeAllRanges();
              sel.addRange(range);
              break;
            } else {
              offset += node.length;
            }
          } else {
            find(pos, node);
          }
        }
      };
      find(pos, element);
    }

    return element;
  };

  /**
   * Get the offset
   *
   * @return {object} The offset
   */
  var getOffset = function getOffset() {
    var range = getRange();
    var offset = {
      height: 0,
      left: 0,
      right: 0
    };

    if (!range) {
      return offset;
    }

    var hasCustomPos = ctx.customPos || ctx.customPos === 0;

    // endContainer in Firefox would be the element at the start of
    // the line
    if (range.endOffset - 1 > 0 && range.endContainer !== element || hasCustomPos) {
      var clonedRange = range.cloneRange();
      var fixedPosition = hasCustomPos ? ctx.customPos : range.endOffset;
      clonedRange.setStart(range.endContainer, fixedPosition - 1 < 0 ? 0 : fixedPosition - 1);
      clonedRange.setEnd(range.endContainer, fixedPosition);
      var rect = clonedRange.getBoundingClientRect();
      offset = {
        height: rect.height,
        left: rect.left + rect.width,
        top: rect.top
      };
      clonedRange.detach();
    }

    if ((!offset || offset && offset.height === 0) && !ctx.noShadowCaret) {
      var _clonedRange = range.cloneRange();
      var shadowCaret = ctx.document.createTextNode('|');
      _clonedRange.insertNode(shadowCaret);
      _clonedRange.selectNode(shadowCaret);
      var _rect = _clonedRange.getBoundingClientRect();
      offset = {
        height: _rect.height,
        left: _rect.left,
        top: _rect.top
      };
      shadowCaret.parentNode.removeChild(shadowCaret);
      _clonedRange.detach();
    }

    if (offset) {
      var doc = ctx.document.documentElement;
      offset.top += ctx.window.pageYOffset - (doc.clientTop || 0);
      offset.left += ctx.window.pageXOffset - (doc.clientLeft || 0);
    }

    return offset;
  };

  /**
   * Get the position
   *
   * @return {object} The position
   */
  var getPosition = function getPosition() {
    var offset = getOffset();
    var pos = getPos();
    var rect = element.getBoundingClientRect();
    var inputOffset = {
      top: rect.top + ctx.document.body.scrollTop,
      left: rect.left + ctx.document.body.scrollLeft
    };
    offset.left -= inputOffset.left;
    offset.top -= inputOffset.top;
    offset.pos = pos;

    return offset;
  };

  /**
   * Get the range
   *
   * @return {Range|null}
   */
  var getRange = function getRange() {
    if (!ctx.window.getSelection) {
      return;
    }
    var sel = ctx.window.getSelection();

    return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  };

  /**
   * Get the caret position
   *
   * @return {int} The position
   */
  var getPos = function getPos() {
    var range = getRange();
    var clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(element);
    clonedRange.setEnd(range.endContainer, range.endOffset);
    var pos = clonedRange.toString().length;
    clonedRange.detach();

    return pos;
  };

  return {
    getPos: getPos,
    setPos: setPos,
    getPosition: getPosition,
    getOffset: getOffset,
    getRange: getRange
  };
};

var createCaret = function createCaret(element, ctx) {
  if (isContentEditable(element)) {
    return createEditableCaret(element, ctx);
  }

  return createInputCaret(element, ctx);
};

var position = function position(element, value) {
  var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var options = settings;
  if (isObject(value)) {
    options = value;
    value = null;
  }
  var ctx = getContext(options);
  var caret = createCaret(element, ctx);

  if (value || value === 0) {
    return caret.setPos(value);
  }

  return caret.getPosition();
};

/**
 *
 * @param {Element} element The DOM element
 * @param {number|undefined} value The value to set
 * @param {object} settings Any settings for context
 */
var offset = function offset(element, value) {
  var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var options = settings;
  if (isObject(value)) {
    options = value;
    value = null;
  }

  var ctx = getContext(options);
  var caret = createCaret(element, ctx);
  return caret.getOffset(value);
};


//# sourceMappingURL=main.js.map


/***/ }),
/* 8 */
/***/ (function(module, exports) {

async function messageBackgroundPage(request, input)
{
   let response = new Promise(function(resolve, reject)
   {
      console.log("MSG: " + request + "(" + JSON.stringify(input) + ")" + typeof(input));
      chrome.runtime.sendMessage({"TabxOp": request, "TabxInput": input},
      function (response) {
         resolve(response.TabxResults);
      });
   });

   let results = await response;

   return results;
}

var WordCompleteModelMSGER = {
   predictCurrentWord: function(input)
   {
      return messageBackgroundPage("WORD_COMPLETE", input)
   }
}

var WordPredictModelMSGER = {
   predictNextWord: function(input)
   {
      return messageBackgroundPage("WORD_PREDICT", input)
   }
}

module.exports = {
   WordCompleteModel: WordCompleteModelMSGER,
   WordPredictModel: WordPredictModelMSGER
}


/***/ })
/******/ ]);