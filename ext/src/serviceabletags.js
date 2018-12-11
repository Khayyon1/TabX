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

module.exports = {
    getServicableElements: getServicableElements,
    activeElementIsServiceable: activeElementIsServiceable
}