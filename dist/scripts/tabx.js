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
const TableView = __webpack_require__(3);
const applySettings = __webpack_require__(6);
//const bgmodels = require("./models/messenger-models");
const mocknext = __webpack_require__(7)
const mockcomp = __webpack_require__(8)

let display = new TableView(document);
let tabx = new TabX(mockcomp,
   mocknext,
   display,
   document);

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

                  if(serviceabletags.activeElementIsServiceable()
                  && this.shortcuts.includes(keyname)
                  && this.mappings[keyname] != undefined)
                  {
                     event.preventDefault();
                     var userChoice = this.mappings[keyname];
                     this.wordCompletion(userChoice);
                  };
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const getCaretCoordinates = __webpack_require__(5);

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
        element.style.backgroundColor = "lightblue";
        element.style.zIndex = 999;

        const rect = textInputBox.getBoundingClientRect();
        const caret = getCaretCoordinates(textInputBox, textInputBox.selectionStart, {debug:true});
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
/***/ (function(module, exports) {

/* jshint browser: true */

(function () {

// We'll copy the properties below into the mirror div.
// Note that some browsers, such as Firefox, do not concatenate properties
// into their shorthand (e.g. padding-top, padding-bottom etc. -> padding),
// so we have to list every single property explicitly.
var properties = [
  'direction',  // RTL support
  'boxSizing',
  'width',  // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
  'height',
  'overflowX',
  'overflowY',  // copy the scrollbar for IE

  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  // https://developer.mozilla.org/en-US/docs/Web/CSS/font
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',

  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',  // might not make a difference, but better be safe

  'letterSpacing',
  'wordSpacing',

  'tabSize',
  'MozTabSize'

];

var isBrowser = (typeof window !== 'undefined');

function getCaretCoordinates(element, position, options) {
  var notDiv = element.tagName != 'DIV';

  var debug = options && options.debug || false;
  if (debug) {
    var el = document.querySelector('#input-textarea-caret-position-mirror-div');
    if (el) el.parentNode.removeChild(el);
  }

  // The mirror div will replicate the textarea's style
  var div = document.createElement('div');
  div.id = 'input-textarea-caret-position-mirror-div';
  document.body.appendChild(div);

  var style = div.style;
  var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;  // currentStyle for IE < 9
  var isInput = element.nodeName === 'INPUT';

  // Default textarea styles
  style.whiteSpace = 'pre-wrap';
  if (!isInput)
    style.wordWrap = 'break-word';  // only for textarea-s

  // Position off-screen
  style.position = 'absolute';  // required to return coordinates properly
  if (!debug)
    style.visibility = 'hidden';  // not 'display: none' because we want rendering

  // Transfer the element's properties to the div
  properties.forEach(function (prop) {
    if (isInput && prop === 'lineHeight') {
      // Special case for <input>s because text is rendered centered and line height may be != height
      style.lineHeight = computed.height;
    } else {
      style[prop] = computed[prop];
    }
  });

  style.overflow = 'hidden';  // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'

  if (notDiv){
    div.textContent = element.value.substring(0, position);
  }else{
    let text = window.getSelection().anchorNode.textContent;
    let caret = window.getSelection().anchorOffset;
    div.textContent = text.substring(0, caret);
  }
  // The second special handling for input type="text" vs textarea:
  // spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
  if (isInput)
    div.textContent = div.textContent.replace(/\s/g, '\u00a0');

  var span = document.createElement('span');
  // Wrapping must be replicated *exactly*, including when a long word gets
  // onto the next line, with whitespace at the end of the line before (#7).
  // The  *only* reliable way to do that is to copy the *entire* rest of the
  // textarea's content into the <span> created at the caret position.
  // For inputs, just '.' would be enough, but no need to bother.
  if(notDiv){
    span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
  }else{
    let text = window.getSelection().anchorNode.textContent;
    let caret = window.getSelection().anchorOffset;
    span.textContent = text.substring(caret) || '.';
  }
  div.appendChild(span);

  var coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    height: parseInt(computed['lineHeight'])
  };

  if (debug) {
    span.style.backgroundColor = '#aaa';
  } else {
    document.body.removeChild(div);
  }

  return coordinates;
}

module.exports = getCaretCoordinates;

}());


/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, exports) {

module.exports = {
    predictNextWord: function(sentence){
        return ["Hello", "World","Goodbye"];
    }
}

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
    predictCurrentWord: function(word){
        return ["Hello", "World","Goodbye"];
    }
}

/***/ })
/******/ ]);