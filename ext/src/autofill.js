class Autofill
{
    constructor(){
        this.completion = true;
        this.lastWord = '';
    }
    toggle(val){
        this.completion = val;
    }
    fill(el, suggestion) {
        if (suggestion != undefined) {
            if (this.completion) {
                const prefix = el.value.split(" ").pop();
                suggestion = suggestion.substring(prefix.length);
            }
            this.lastWord = suggestion;
            el.value += suggestion;
            el.selectionStart = el.value.length - suggestion.length;
            el.selectionEnd = el.value.length;
        }else{
            this.lastWord = '';
        }
    }
    shortcutPressed(el){
        el.value = el.value.substring(0, el.value.length - this.lastWord.length);
    }
}

module.exports = Autofill;