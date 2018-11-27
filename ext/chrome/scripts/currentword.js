document.addEventListener("click", printCurrentWordInActiveTextField);

function printActiveElement()
{
   console.log(document.activeElement);
}

function printTextField()
{

   var activeElement = document.activeElement;
   if (activeElement.tagName == 'INPUT'){
      console.log("I AM TEXTFIELD!");
   }
}


function printTextFieldContents()
{
   if(activeElementIsTextField())
   {
      console.log(document.activeElement.value);
   }
}

function activeElementIsTextField()
{
   var activeElement = document.activeElement;
   return activeElement.tagName == 'INPUT';
}

function printCurrentWordInActiveTextField()
{
   console.log("got here");
   if(activeElementIsTextField())
   {
      console.log(getCurrentWord(document.activeElement));
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
      var i = caret;
      while(i > 0 && text.charAt(i - 1).match(/\w/))
      {
          i--;
      }
      if(i == 0)
      {
         return text.substring(0, caret);
      }
      else
      {
         return text.substring(i, caret);
      }
   }

   else
   {
      return "";
   }
}
