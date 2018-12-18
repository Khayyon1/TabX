const position = require('caret-pos').position;

/** Class for stylizing HTML elements of TabX Table */
const Style = class
{
    /**
     * Constructor
     */
    constructor(){
        this.cache = {};
        this.offset_y = 0;
    }

    /**
     * Stylizes entire TabX table
     * @param {HTMLElement} element - TabX table
     * @param {HTMLElement} textInputBox - input element TabX table is attached to
     */
    table(element, textInputBox)
    {
        element.style.display = 'flex';
        element.style.position = 'absolute';
        element.style.backgroundColor = "lightgrey";
        element.style.zIndex = 999;

        const rect = textInputBox.getBoundingClientRect();
        const caret = position(textInputBox);
        this.offset_y = window.getComputedStyle(textInputBox, "").fontSize;
        this.offset_y = this.pxToInt(this.offset_y) - textInputBox.scrollTop;
        this.offset_y += 3;
        element.style.top = (rect.top + caret.top + this.offset_y).toString() + 'px';
        element.style.left = (rect.left + caret.left).toString() + 'px';
    }

    /**
     * Updates element position based on caret position
     * @param {HTMLElement} element - TabX table
     */
    updatePosition(element)
    {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const elRect = element.getBoundingClientRect();
        const left = this.pxToInt(element.style.left);
        const top = this.pxToInt(element.style.top);

        if (elRect.right > w) {
            const offset_x = elRect.right - w;
            element.style.left = (left - offset_x).toString() + 'px'
        }

        if (elRect.bottom > h){
            const offset_y = 2*this.offset_y + parseInt(this.settings.fontsize);
            element.style.top = (top - offset_y).toString() + 'px'
        }

    }

    /**
     * Converts pixels to integers
     * @param {pixels} px - pixel to be converted
     */
    pxToInt(px){
        return parseInt(px.slice(0, px.length - 2))
    }

    /**
     * Styizes inidivdual rows in TabX table
     * @param {HTMLElement} element - row from TabX table
     * @param {number} offset - spacing between rows
     */
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
