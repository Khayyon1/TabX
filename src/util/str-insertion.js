function wordCompletion(activeElement, userChoice)
{
        activeElement.value = this.replaceWordAt(
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

        return before + word + after;
}

function getCurrentWord(text, caret)
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
