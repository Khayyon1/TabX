// TabX Shortcuts

var serviceabletags = require('./util/serviceabletags');
var _current_word = "";

var _debug = false;

const TabX = class
{
   constructor(wordCompleteModel,
      wordPredictModel,
      abbrevExpansionModel,
      displayStrategy,
      document=document,
      filter={"filter": (str) => str},
      wordCompleteEnabled=true,
      wordPredictEnabled=true,
      filterEnabled=true,
      abbrevExpansionEnabled=true)
      {
         this.wordCompleteModel = wordCompleteModel;
         this.wordPredictModel = wordPredictModel;
         this.displayStrategy = displayStrategy;
         this.shortcuts = ["1", "2", "3"];
         this.document = document;
         this.wordPredictEnabled = wordPredictEnabled;
         this.wordCompleteEnabled = wordCompleteEnabled;
         this.abbrevExpansionModel = abbrevExpansionModel;
         this.enabled = true;
         this.suggestionsDisplayCount = 3;
         this.filter = filter;
         this.filterEnabled = filterEnabled;
         this.abbrevExpansionEnabled = abbrevExpansionEnabled;
         this.tabCount = -1;

         this.registerListeners();

      }

   setDocument(document)
   {
      this.document = document;
   }

   setDisplay(display)
   {
      this.displayStrategy.tearDown();
      this.displayStrategy = display;
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
         let info = serviceabletags.caretAndTextOfEditableDiv(elem,
             window.getSelection().baseNode);
         caret = info["caret"];
         text = info["text"];
         previous = info["text"].charAt(caret - 1);
         charAtCaret = info["text"].charAt(caret);
      }

      else
      {
         throw new Error("Active element not serviceable");
      }


      //Grab the current word before filter happens
      let currentWord = this.getCurrentWord(text, caret);
      if(this.filterEnabled)
      {
         text = this.filter.filter(text);
      }

      //Check for whether we can do word prediction
      var charBeforeCaret = /\S/.test(previous);
      if(charBeforeCaret && this.wordCompleteEnabled)
      {
         let results = []
         if(this.abbrevExpansionEnabled)
         {
            results = this.abbrevExpansionModel.expand(currentWord);
         }

         if(results.length === 0)
         {
            return await this.getSuggestions(currentWord);
         }

         return results;

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

      enableFilter()
      {
         this.filterEnabled = true;
      }

      disableFilter()
      {
         this.filterEnabled = false;
      }

      enableAbbreviationExpansion()
      {
         this.abbrevExpansionEnabled = true;
      }

      disableAbbreviationExpansion()
      {
         this.abbrevExpansionEnabled = false;
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
