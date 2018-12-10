const Style = class
{
    constructor(){
        this.cache = {};
    }
    table(element, input_bounds, textInputBox)
    {
        console.log('textInputBox', textInputBox)
        element.style.display = 'flex';
        element.style.position = 'absolute';
        element.style.backgroundColor = "lightblue";
        element.style.zIndex = 999;
        element.style.left = (input_bounds.left).toString() + "px";
        element.style.top = (input_bounds.top + input_bounds.height).toString() + "px";
        if (textInputBox != undefined){
            const cursorPosition = textInputBox.selectionStart;
            let font = window.getComputedStyle(textInputBox, "").font;
            let fontSize = window.getComputedStyle(textInputBox, "").fontSize;
            const txt = textInputBox.value.slice(0, cursorPosition+1);
            const size = this.calcSize(txt, {
                font: font,
                fontSize: fontSize
            });
            element.style.transform = "translate(" + size.width + "px)";
        }
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