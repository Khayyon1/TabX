// this.document.addEventListener("keyup", displaySuggestions);

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
    }

    setDocument(document)
    {
        this.document = document;
    }

    async getAppropriateSuggestions()
    {
        var elem = this.document.activeElement
        var previous = elem.value.charAt(elem.selectionStart - 1)
        if(previous != " " && this.wordCompleteEnabled)
        {
            return await this.getSuggestions(this.getCurrentWord(elem))
        }

        else if(this.wordPredictEnabled)
        {
            return await this.getNextWordSuggestion(elem.value)
        }
    }

    async displaySuggestions()
    {
        if(!this.activeElementIsTextField()
            ||
            this.document.activeElement.value == ""
            ||
            this.getCurrentWord(this.document.activeElement) == "")
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

    activeElementIsTextField()
    {
        var activeElement = this.document.activeElement;
        return activeElement.tagName == 'INPUT';
    }

    wordCompletion(activeElement, userChoice)
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

    async getSuggestions(incomplete_string)
    {
        if(this.inputIsNotValid(incomplete_string))
        {
            return [];
        }

        let results = this.wordCompleteModel.predictCurrentWord(incomplete_string);

        if(typeof(results) == Promise)
        {
            return await results;
        }

        return results;
    }


    async getNextWordSuggestion(str)
    {
        var caret_position = this.document.activeElement.selectionStart;
        var left_of_caret = caret_position - 1;
        var space_precedes_caret = str.charAt(left_of_caret) == " ";
        var currentWord = this.getCurrentWord(this.document.activeElement);

        if(this.inputIsNotValid(currentWord) || !space_precedes_caret)
        {
            return [];
        }
        
        let results = this.wordPredictModel.predictNextWord(this.getCurrentWord(this.document.activeElement));

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

        if (this.activeElementIsTextField() && this.enabled)
        {
            this.displaySuggestions();
        }
    }

    registerListeners()
    {
        //Provide suggestions based on developing word
        this.document.addEventListener('keydown', this.handleWordComplete.bind(this));

        //Shows suggestions
        this.document.addEventListener('keyup', this.handleUserInput.bind(this));
        var serviceableElements = this.document.querySelectorAll("input[type=text]");

        //Listens for when active elements lose focus
        for(var i = 0; i < serviceableElements.length; i++)
        {
            var elem = serviceableElements[i];
            elem.addEventListener('blur', function()
            {
               this.displayStrategy.tearDown();
               console.log(this.displayStrategy);
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

    handleWordComplete(event)
    {
        if(!this.enable){return;}
        var keyname = event.key;
        if(this.activeElementIsTextField() && this.shortcuts.includes(keyname) && this.displayStrategy.isActive())
        {
            event.preventDefault();
            var userChoice = this.mappings[keyname];
            this.wordCompletion(this.document.activeElement, userChoice);
        };
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

};

module.exports = TabX;
