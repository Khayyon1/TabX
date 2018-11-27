//pass it a string and it will autocomplete the word in focus

function wordCompletion(activeElement, userChoice ='world')
{
    activeElement.value = replaceWordAt(
        activeElement.value,
        activeElement.selectionStart,
        userChoice);
}

function replaceWordAt(str, i, word, delimiter=' ')
{
    startOfWord = word.lastIndexOf(delimiter, i);
    before = str.substring(0, startOfWord);
    after  = str.substring(i);
    return before + word + after;
}
