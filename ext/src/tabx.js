// this.document.addEventListener("keyup", displaySuggestions);

var _current_word = "";

//import {wordCompleteModel} from './models/wordcomplete.js';
var _debug = true;

const TabX = class
{
   constructor(wordCompleteModel, wordPredictModel, document=document)
   {
      this.wordCompleteModel = wordCompleteModel;
      this.wordPredictModel = wordPredictModel;
      this.document = document;
      this.registerEventListeners();
   }

   displaySuggestions(activeElement)
   {
      if(!this.activeElementIsTextField()){
         return;
      }

      var current_table = this.document.getElementById("suggestionsTable");

      if(debug)
      {
         console.log("current word: " + this.getCurrentWord(this.document.activeElement))
         console.log(current_table);
      }

      if(current_table != null)
      {
         this.document.body.removeChild(current_table);
      }

      if(this.document.activeElement.value == "" || this.getCurrentWord(this.document.activeElement) == ""){
            return;
      }

      var table = this.document.createElement("table");
      table.id = "suggestionsTable"

      table.style.position = 'fixed';
      var input_bounds = this.document.activeElement.getBoundingClientRect();

      table.style.left = (input_bounds.left).toString() + "px";
      table.style.top = (input_bounds.top + 20).toString()+"px";


      console.log(this.document.activeElement.value);
      var suggestions = this.getSuggestions(this.getCurrentWord(this.document.activeElement));
      for(var i = 0; i < suggestions.length; i++)
      {
          var row = this.document.createElement("tr");
          var column1 = this.document.createElement("td");
          var column2 = this.document.createElement("td");
          column1.appendChild(this.document.createTextNode(((i+1).toString())));
          column2.appendChild(this.document.createTextNode(suggestions[i]));
          row.append(column1);
          row.append(column2);
          table.appendChild(row);
      }

      this.document.body.appendChild(table);
   }

   activeElementIsTextField()
   {
      var activeElement = this.document.activeElement;
      return activeElement.tagName == 'INPUT';
   }

   wordCompletion(activeElement, userChoice ='world')
   {
       activeElement.value = this.replaceWordAt(
           activeElement.value,
           activeElement.selectionStart,
           userChoice);
   }

   replaceWordAt(str, i, word, delimiter=' ')
   {
       var startOfWord = str.lastIndexOf(delimiter, i - 1);
       var before = str.substring(0, startOfWord);

       if (before != "" && before != null)
       {
           before += " "
       }

       var after  = str.substring(i);

       if(after.charAt(0) != "" && after.charAt(0) != " ")
       {
         after = " " + after;
       }

       console.log("Start   : " + startOfWord.toString());
       console.log("Before  : " + before);
       console.log("Replace : " + word);
       console.log("After   : " + after);

       return before + word + after;
   }

   //Assumes that the caret is at the end of a word in a text field
   getCurrentWord(inputField)
   {
      var text = inputField.value;
      var caret = inputField.selectionStart;

      if(caret == 0)
      {
         return "";
      }

      var prev = text.charAt(caret - 1);

      //Make sure caret is at the end of a developing word
      if(prev.match(/\w/))
      {
         //Iterate backwards to find the first instance of a white space
          // 0 to caret
         var startOfWord = this.indexOfStartOfCurrentWord(text, caret);

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

   getSuggestions(incomplete_string)
   {
      return this.wordCompleteModel.predictCurrentWord(incomplete_string);
   }

   handleUserInput(event)
   {
       if (this.activeElementIsTextField())
       {
           this.displaySuggestions(this.document.activeElement);
       }
   }

   registerEventListeners()
   {
      this.document.addEventListener('keydown', this.handleWordComplete.bind(this));
      this.document.addEventListener('keyup', this.handleUserInput.bind(this));
   }

   suggestionsAreBeingDisplayed()
   {
       return this.document.getElementById("suggestionsTable") != null
   }

   handleWordComplete(event)
   {
       var keyname = event.key;
       var choices = ["1", "2", "3"];
       if(this.activeElementIsTextField() && choices.includes(keyname) && this.suggestionsAreBeingDisplayed())
       {
           event.preventDefault();
           this.wordCompletion(this.document.activeElement, this.getSuggestions(this.getCurrentWord(this.document.activeElement))[parseInt(keyname) - 1])
       }
   }
};

module.exports = TabX;
