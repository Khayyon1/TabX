document.addEventListener("keyup", storeCurrentWord);
let _current_word = "";

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
    startOfWord = word.lastIndexOf(delimiter, i);
    before = str.substring(0, startOfWord);
    after  = str.substring(i);
    return before + word + after;
}

function storeCurrentWord(){
    if(activeElementIsTextField())
    {
        _current_word = getCurrentWord(document.activeElement);
        console.log(_current_word);
    }
}


//Assumes that the caret is at the end of a word in a text field
function getCurrentWord(inputField)
{
   text = inputField.value;
   caret = inputField.selectionStart;

   if(caret == 0)
   {
      return "";
   }

   prev = text.charAt(caret - 1);

   //Make sure caret is at the end of a developing word
   if(prev.match(/\w/) && (caret == text.length || text.charAt(caret).match(/\W/)))
   {
      //Iterate backwards to find the first instance of a white space
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
