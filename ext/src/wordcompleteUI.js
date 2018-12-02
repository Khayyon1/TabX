// document.addEventListener("keyup", displaySuggestions);

var _current_word = "";

//import {wordCompleteModel} from './models/wordcomplete.js';

const WordCompleteModel = require("./models/wordcomplete");

function displaySuggestions(activeElement)
{
   if(!activeElementIsTextField()){
      return;
   }

   var current_table = document.getElementById("suggestionsTable");

   console.log("current word: " + getCurrentWord(document.activeElement))
   console.log(current_table);
   if(current_table != null)
   {
      document.body.removeChild(current_table);
   }

   if(document.activeElement.value == "" || getCurrentWord(document.activeElement) == ""){
         return;
   }

   var table = document.createElement("table");
   table.id = "suggestionsTable"

    table.style.position = 'fixed';
    var input_bounds = document.activeElement.getBoundingClientRect();

    table.style.left = (input_bounds.left).toString() + "px";
    table.style.top = (input_bounds.top + 20).toString()+"px";

   console.log(document.activeElement.value);
   var suggestions = getSuggestions(getCurrentWord(document.activeElement));
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

function activeElementIsTextField()
{
   var activeElement = document.activeElement;
   return activeElement.tagName == 'INPUT';
}

function wordCompletion(activeElement, userChoice ='world')
{
    activeElement.value = replaceWordAt(
        activeElement.value,
        activeElement.selectionStart,
        userChoice);
}

function replaceWordAt(str, i, word, delimiter=' ')
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

function storeCurrentWord(){
    if(activeElementIsTextField())
    {
        _current_word = getCurrentWord(document.activeElement);
        console.log(_current_word);
        console.log("Suggestions: " + getSuggestions(_current_word));
    }
}


//Assumes that the caret is at the end of a word in a text field
function getCurrentWord(inputField)
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
      var startOfWord = indexOfStartOfCurrentWord(text, caret);

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

function indexOfStartOfCurrentWord(text, caret)
{
      //Iterate backwards to find the first instance of a white space
      var i = caret;
      while(i > 0 && text.charAt(i - 1).match(/\w/))
      {
          i--;
      }

      return i;
}

function getSuggestions(incomplete_string)
{
   console.log(WordCompleteModel);
   return WordCompleteModel.WordCompleteModel.predictCurrentWord(incomplete_string);
}

function handleUserInput(event)
{
    if (activeElementIsTextField())
    {
        displaySuggestions(document.activeElement);
    }
}

document.addEventListener('keydown', handleWordComplete);
document.addEventListener('keyup', handleUserInput);

function suggestionsAreBeingDisplayed() {
    return document.getElementById("suggestionsTable") != null
}

function handleWordComplete(event){
    var keyname = event.key;
    var choices = ["1", "2", "3"];
    if(activeElementIsTextField() && choices.includes(keyname) && suggestionsAreBeingDisplayed())
    {
        event.preventDefault();
        wordCompletion(document.activeElement, getSuggestions(getCurrentWord(document.activeElement))[parseInt(keyname) - 1])
    }
}

module.exports = {
   getSuggestions: getSuggestions,
   getCurrentWord: getCurrentWord,
   wordCompletion: wordCompletion
}
