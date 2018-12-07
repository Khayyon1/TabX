// this.document.addEventListener("keyup", displaySuggestions);

var _current_word = "";

//import {wordCompleteModel} from './models/wordcomplete.js';
var _debug = false;

const TabX = class
{
    constructor(wordCompleteModel, wordPredictModel, document=document)
    {
        this.wordCompleteModel = wordCompleteModel;
        this.wordPredictModel = wordPredictModel;
        this.document = document;
        this.registerEventListeners();
        this.SUGGESTIONS_TABLE = "suggestionsTable";
    }

    removeActiveTable()
    {
        var current_table = this.document.getElementById(this.SUGGESTIONS_TABLE);
        if(current_table != null)
        {
            this.document.body.removeChild(current_table);
        }
    }

    createSuggestionsTable()
    {
        var table = this.document.createElement("table");
        table.id = this.SUGGESTIONS_TABLE;
        table.className = "suggestions";
        table.style.position = 'absolute';
        var input_bounds = this.document.activeElement.getBoundingClientRect();
        table.style.backgroundColor = "lightblue";
        table.style.zIndex = 999;
        table.style.left = (input_bounds.left).toString() + "px";
        table.style.top = (input_bounds.top + input_bounds.height).toString()+"px";
        return table
    }

    getAppropriateSuggestions()
    {
        var elem = this.document.activeElement
        var previous = elem.value.charAt(elem.selectionStart - 1)
        if(previous != " ")
        {
            return this.getSuggestions(this.getCurrentWord(elem))
        }
        else
        {
            return this.getNextWordSuggestion(elem.value)
        }
    }

    displaySuggestions(activeElement)
    {
        if(!this.activeElementIsTextField()){
            return;
        }


        this.removeActiveTable();
        if(this.document.activeElement.value == "" || this.getCurrentWord(this.document.activeElement) == "")
        {
            return;
        }

        var table = this.createSuggestionsTable();

        var suggestions = this.getAppropriateSuggestions();

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

        //Check to see if the previoius character is a whitespace
        //If it is not, push previous back one to allow the current
        //word be the word that comes before a whitespace
        //Ex. "hello |" -> "hello"
        var prev = text.charAt(caret - 1);
        if(prev === " "){
            prev = text.charAt(caret - 2);
            caret -= 1;
        }

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

    inputHasCharactersOtherThanLetters(string)
    {
        return (/[^a-zA-Z\s]/).test(string)
    }

    inputIsEmpty(string)
    {
        return string === "";
    }

    inputIsNotValid(str)
    {
        return this.inputHasCharactersOtherThanLetters(str) || this.inputIsEmpty(str);
    }

    getSuggestions(incomplete_string)
    {
        if(this.inputIsNotValid(incomplete_string))
        {
            return [];
        }

        else
        {
            return this.wordCompleteModel.predictCurrentWord(incomplete_string);
        }

    }


    getNextWordSuggestion(str)
    {
        var caret_position = this.document.activeElement.selectionStart;
        var left_of_caret = caret_position - 1;
        var space_precedes_caret = str.charAt(left_of_caret) == " ";
        var currentWord = this.getCurrentWord(this.document.activeElement);

        if(this.inputIsNotValid(currentWord) || !space_precedes_caret)
        {
            return [];
        }
        else
        {
            return this.wordPredictModel.predictNextWord(this.getCurrentWord(this.document.activeElement));
        }
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
        var serviceableElements = this.document.querySelectorAll("input[type=text]");
        for(var i = 0; i < serviceableElements.length; i++)
        {
            var elem = serviceableElements[i];
            elem.addEventListener('blur', function()
            {
                var table = this.document.getElementById("suggestionsTable");
                if(table != null)
                {
                    table.parentNode.removeChild(table);
                }
            }.bind(this))
        };
    }

    suggestionsAreBeingDisplayed()
    {
        return this.document.getElementById(this.SUGGESTIONS_TABLE) != null
    }

    handleWordComplete(event)
    {
        var keyname = event.key;
        var choices = ["1", "2", "3"];
        if(this.activeElementIsTextField() && choices.includes(keyname) && this.suggestionsAreBeingDisplayed())
        {
            event.preventDefault();
            var userChoice = this.document.getElementById(this.SUGGESTIONS_TABLE).rows[keyname - 1].cells[1].innerHTML;
            this.wordCompletion(this.document.activeElement, userChoice);
        }
    }
};

module.exports = TabX;
