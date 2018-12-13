const getCaretCoordinates = require('textarea-caret');

const Style = class
{
    constructor(){
        this.cache = {};
    }
    table(element, textInputBox)
    {
        const elRect = element.getBoundingClientRect();
        console.log('MISHI', elRect)
        element.style.display = 'flex';
        element.style.position = 'absolute';
        element.style.backgroundColor = "lightblue";
        element.style.zIndex = 999;

        const rect = textInputBox.getBoundingClientRect();
        const caret = getCaretCoordinates(textInputBox, textInputBox.selectionStart);
        element.style.top = (rect.top + caret.top).toString()+'px';
        element.style.left = (rect.left + caret.left).toString() + 'px';
    }

    updatePosition(element){
        const w = window.innerWidth;
        const h = window.innerHeight;

        const elRect = element.getBoundingClientRect();
        const left = this.pxToInt(element.style.left);

        if (elRect.right > w) {
            const offset_x = elRect.right - w;
            element.style.left = (left - offset_x).toString() + 'px'
        }

    }
    pxToInt(px){
        return parseInt(px.slice(0, px.length - 2))
    }
    row(element, offset=6)
    {
        element.style.marginRight = offset.toString() + 'px';
    }
    calcSize(text, options = {}) {

        const cacheKey = JSON.stringify({ text: text, options: options })

        if (this.cache[cacheKey]) {
            return this.cache[cacheKey]
        }

        // prepare options
        options.font = options.font || 'Times'
        options.fontSize = options.fontSize || '16px'
        options.fontWeight = options.fontWeight || 'normal'
        options.lineHeight = options.lineHeight || 'normal'
        options.width = options.width || 'auto'
        options.wordBreak = options.wordBreak || 'normal'

        const element = this.createDummyElement(text, options)

        const size = {
            width: element.offsetWidth,
            height: element.offsetHeight,
        }

        this.destroyElement(element)

        this.cache[cacheKey] = size

        return size
    }
    destroyElement(element) {
        element.parentNode.removeChild(element)
    }
    createDummyElement(text, options) {
        const element = document.createElement('div')
        const textNode = document.createTextNode(text)

        element.appendChild(textNode)

        element.style.fontFamily = options.font
        element.style.fontSize = options.fontSize
        element.style.fontWeight = options.fontWeight
        element.style.lineHeight = options.lineHeight
        element.style.position = 'absolute'
        element.style.visibility = 'hidden'
        element.style.left = '-999px'
        element.style.top = '-999px'
        element.style.width = options.width
        element.style.height = 'auto'
        element.style.wordBreak = options.wordBreak

        document.body.appendChild(element)

        return element
    }
}

module.exports = Style;
