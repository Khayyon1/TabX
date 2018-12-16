const getCaretCoordinates = require('textarea-caret');

const Style = class
{
    constructor(){
        this.cache = {};
        this.offset_y = 0;
    }
    table(element, textInputBox)
    {
        element.style.display = 'flex';
        element.style.position = 'absolute';
        element.style.backgroundColor = "lightblue";
        element.style.zIndex = 999;

        const rect = textInputBox.getBoundingClientRect();
        const caret = getCaretCoordinates(textInputBox, textInputBox.selectionStart);
        this.offset_y = window.getComputedStyle(textInputBox, "").fontSize;
        this.offset_y = this.pxToInt(this.offset_y) - textInputBox.scrollTop;
        element.style.top = (rect.top + caret.top + this.offset_y).toString() + 'px';
        element.style.left = (rect.left + caret.left).toString() + 'px';
    }

    updatePosition(element){
        const w = window.innerWidth;
        const h = window.innerHeight;

        const elRect = element.getBoundingClientRect();
        const left = this.pxToInt(element.style.left);
        const top = this.pxToInt(element.style.top);

        console.log('Mishiii', w, elRect.right)
        console.log(elRect)

        if (elRect.right > w) {
            const offset_x = elRect.right - w;
            element.style.left = (left - offset_x).toString() + 'px'
        }

        if (elRect.bottom > h){
            const offset_y = 2*this.offset_y + parseInt(this.settings.fontsize);
            element.style.top = (top - offset_y).toString() + 'px'
        }

    }
    pxToInt(px){
        return parseInt(px.slice(0, px.length - 2))
    }
    row(element, offset=6)
    {
        element.style.marginRight = offset.toString() + 'px';
        if (this.settings){
            element.style.fontFamily = this.settings.font;
            element.style.fontSize = this.settings.fontsize+"px";
            element.style.color = this.settings.fontcolor;
            element.style.fontWeight = this.settings.fontstyle.toLowerCase();
        }
    }
}

module.exports = Style;
