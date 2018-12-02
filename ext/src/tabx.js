// document.addEventListener("keyup", displaySuggestions);

var _current_word = "";

//import {wordCompleteModel} from './models/wordcomplete.js';


const TabX = class
{
   constructor(wordCompleteModel)
   {
      this.wordCompleteModel = wordCompleteModel;
      this.registerEventListeners();
   }

   displaySuggestions(activeElement)
   {
      if(!this.activeElementIsTextField()){
         return;
      }

      var current_table = document.getElementById("suggestionsTable");

      console.log("current word: " + this.getCurrentWord(document.activeElement))
      console.log(current_table);
      if(current_table != null)
      {
         document.body.removeChild(current_table);
      }

      if(document.activeElement.value == "" || this.getCurrentWord(document.activeElement) == ""){
            return;
      }

      var table = document.createElement("table");
      table.id = "suggestionsTable"

      table.style.position = 'fixed';
      var input_bounds = document.activeElement.getBoundingClientRect();

      table.style.left = (input_bounds.left).toString() + "px";
      table.style.top = (input_bounds.top + 20).toString()+"px";

      console.log(document.activeElement.value);
      var suggestions = this.getSuggestions(this.getCurrentWord(document.activeElement));
      for(var i = 0; i < suggestions.length; i++)
      {
          var row = document.createElement("tr");
          var column1 = document.createElement("td");
          var column2 = document.createElement("td");
          column1.appendChild(document.createTextNode(((i+1).toString())));
          column2.appendChild(document.createTextNode(suggestions[i]));
          row.append(column1);
          row.append(column2);
          table.appendChild(row);
      }

      document.body.appendChild(table);
   }

   activeElementIsTextField()
   {
      var activeElement = document.activeElement;
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
           this.displaySuggestions(document.activeElement);
       }
   }

   registerEventListeners()
   {
      document.addEventListener('keydown', this.handleWordComplete.bind(this));
      document.addEventListener('keyup', this.handleUserInput.bind(this));
   }

   suggestionsAreBeingDisplayed()
   {
       return document.getElementById("suggestionsTable") != null
   }

   handleWordComplete(event)
   {
       var keyname = event.key;
       var choices = ["1", "2", "3"];
       if(this.activeElementIsTextField() && choices.includes(keyname) && this.suggestionsAreBeingDisplayed())
       {
           event.preventDefault();
           this.wordCompletion(document.activeElement, this.getSuggestions(this.getCurrentWord(document.activeElement))[parseInt(keyname) - 1])
       }
   }
};

module.exports = TabX;
