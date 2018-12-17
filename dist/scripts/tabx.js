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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const TabX = __webpack_require__(2);
const TableView = __webpack_require__(3);
const applySettings = __webpack_require__(4);
//const bgmodels = require("./models/messenger-models");
const mocknext = __webpack_require__(5)
const mockcomp = __webpack_require__(6)

let display = new TableView(document);
let tabx = new TabX(mockcomp,
   mocknext,
   display,
   document);

applySettings(tabx);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// TabX Shortcuts

var serviceabletags = __webpack_require__(0);
var _current_word = "";

//import {wordCompleteModel} from './models/wordcomplete.js';
var _debug = false;

const TabX = class
{
   constructor(wordCompleteModel,
      wordPredictModel,
      displayStrategy,
      document=document,
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
         if(!serviceabletags.activeElementIsServiceable()
         ||
         this.document.activeElement.value == "")
         {
            this.displayStrategy.tearDown();
            return;
         }

         let suggestions = await this.getAppropriateSuggestions();
         suggestions = suggestions.slice(0, this.suggestionsDisplayCount);

         if(suggestions == undefined || suggestions.length == 0)
         {
            this.displayStrategy.tearDown();
            return;
         }

         this.mappings = {};

         for(let i = 0; i < suggestions.length; i++)
         {
            let shortcut = this.shortcuts[i];
            let suggestion = suggestions[i];

            //Every shortcut is mapped to a suggestion that TabX can reference
            //later
            this.mappings[shortcut] = suggestion;
         }

         this.displayStrategy.tearDown();
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

                  console.log("WORD COMPLETION FOR DIV");
                  console.log("-----------------------");
                  console.log("NODE VALUE: " + JSON.stringify(target.nodeValue)
                     + " (" + caret + ")");

                  let start = selection.anchorOffset;
                  let isPredictingNextWord = /\s/.test(target.
                     nodeValue.charAt(start - 1));

                  let offset = this.getCurrentWord(target.
                     nodeValue, start).length;

                  console.log("CHAR AT START:   " + JSON.stringify(target.
                     nodeValue.charAt(start)));
                  console.log("-----------------------");

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
                  if (before != "" && before != null)
                  {
                     before += " "
                  }

                  let after  = str.substring(i);

                  if(after.charAt(0) != "" && after.charAt(0) != " ")
                  {
                     after = " " + after;
                  }

                  return before + word + after;
               }

               getCurrentWord(text, caret)
               {
                  if(caret == 0)
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

                     if(startOfWord == 0)
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

                  if(typeof(results) == Promise)
                  {
                     return await results;
                  }

                  return results;
               }

               async getNextWordSuggestion(str)
               {
                  let results = this.wordPredictModel.predictNextWord(str);
                  if(typeof(results) == Promise)
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

                  if(serviceabletags.activeElementIsServiceable()){
                     let userChoice;

                     if (keyname == 'Tab')
                     {
                        event.preventDefault();
                        this.tabCount = (this.tabCount + 1) % this.suggestionsDisplayCount;
                        userChoice = this.mappings[this.shortcuts[this.tabCount]];
                     }
                     else if (this.shortcuts.includes(keyname))
                     {
                        this.tabCount = -1;
                        event.preventDefault();
                        userChoice = this.mappings[keyname];
                     }
                     if (userChoice)
                     {
                        this.wordCompletion(userChoice);
                     }
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
                  this.displayStrategy.config(settings);
               }

               setSuggestionsDisplayCount(count)
               {
                  this.suggestionsDisplayCount = count;
                  this.displayStrategy.setSuggestionsDisplayCount(count);
               }
            };

            module.exports = TabX;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const serviceabletags = __webpack_require__(0);

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
		style.backgroundColor = "#696969";

	}

	styleTableEntry(row)
	{
		let attrs =
		{
			"border": "1px solid #darkgrey",
			"textAlign": "center",
			"padding": "8px",
			"backgroundColor": "lightgrey",
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
	setSuggestionsDisplayCount(count)
	{
		this.displayCount = count;
		this.tearDown();
		this.createSuggestionsTable();
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


/***/ }),
/* 4 */
/***/ (function(module, exports) {

function applySettings(tabx)
{
   chrome.storage.local.get(function (results)
   {
      if (results != null)
      {
         console.log("Current word enabled: " + results["Current Word"]);
         console.log("Next word enables: " + results["Next Word"]);

         if (!results['activated'])
         {
            console.log("Disabled upon init");
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
         if(quantity == null || quantity == undefined || quantity == 0)
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
/* 5 */
/***/ (function(module, exports) {

module.exports = {
    predictNextWord: function(sentence){
        return ["Hello", "World","Goodbye"];
    }
}

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = {
    predictCurrentWord: function(word){
        return ["Hello", "World","Goodbye"];
    }
}

/***/ })
/******/ ]);