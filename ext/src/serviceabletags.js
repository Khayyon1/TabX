var selector = 'input[type=text], textarea, [contenteditable=true], [contenteditable]';

var serviceableTags = [
    "input[type=text]",
    'textarea',
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

function caretAndText(parentEditableDiv, targetDiv)
{
   if(parentEditableDiv == targetDiv)
   {
      return window.getSelection().anchorOffset;
   }

   let text = getText(parentEditableDiv, targetDiv);
   let caret = (text.length + window.getSelection().anchorOffset)

   return {text: test, caret: caret};
}

function getTextInEditableDiv(root, target)
{
   let cur = target;
   let text = "";
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

      //Edge case if the parent node is a div or p tag
      //since the text associated with the parent is its child,
      //which cannot be detected with the above check in the while
      //loop
      cur = cur.parentNode;
      if(["P", "DIV"].includes(cur.tagName))
      {
         text = " " + text;
      }
   }

   return text;
}


module.exports = {
    getServicableElements: getServicableElements,
    activeElementIsServiceable: activeElementIsServiceable
}
