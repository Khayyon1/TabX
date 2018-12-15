var selector = 'input[type=text], textarea, [contenteditable=true], [contenteditable]';

var serviceableTags = [
   "input[type=text]",
   'textarea',
   "[contenteditable=true]",
   "[contenteditable]"
]

var input = [
   "input[type=text]",
   'textarea'
]

var contenteditable = [
   "[contenteditable=true]",
   "[contenteditable]"
]

function getServicableElements()
{
   return document.querySelectorAll(selector);
}

function activeElementIsServiceable()
{
   let activeElement = document.activeElement;
   for(let i = 0; i < serviceableTags.length; i++)
   {
      if(activeElement.matches(serviceableTags[i]))
      {
         return true;
      }
   }

   return false;
}

function isInput(tag)
{
   for(let matcher of input)
   {
      if(tag.matches(matcher))
      {
         return true;
      }
   }

   return false;
}

function isContentEditable(tag)
{
      for(let matcher of contenteditable)
      {
         if(tag.matches(matcher))
         {
            return true;
         }
      }

   return false;
}


function caretAndTextOfEditableDiv(parentEditableDiv, targetDiv)
{
   if(parentEditableDiv == targetDiv)
   {
      return window.getSelection().anchorOffset;
   }

   let texts = getTextUpToChildInEditableDiv(parentEditableDiv, targetDiv)
   let base = texts[0];
   let activeElementText = texts[1];
   let offset = window.getSelection().anchorOffset;
   let caret = (base.length + offset)
   let stringUpToCaret = activeElementText.substr(0, offset)
   return {"text": base + stringUpToCaret, "caret": caret } ;
}

function getTextUpToChildInEditableDiv(root, target)
{
   let cur = target;
   let activeNodeText = target.textContent;
   let text = ""
   while(cur != root)
   {
      while(cur.previousSibling != null)
      {
         cur = cur.previousSibling;
         text = cur.textContent + text;
         if(["P", "DIV"].includes(cur.tagName))
         {
            text = " " + text;
         }
      }

      //Edge case if the parent node is a div or p tag.
      //since the text associated with the parent is one
      //of its child nodes.
      cur = cur.parentNode;
      if(["P", "DIV"].includes(cur.tagName))
      {
         text = " " + text;
      }
   }

   return [text, activeNodeText];
}

module.exports =
{
   isInput: isInput,
   isContentEditable: isContentEditable,
   getServicableElements: getServicableElements,
   activeElementIsServiceable: activeElementIsServiceable,
   caretAndTextOfEditableDiv: caretAndTextOfEditableDiv,
}
