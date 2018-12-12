class Autofill
{
    constructor(){
        this.completion = true;
        this.lastWord = '';
        this.active = false;
    }
    toggle(val){
        this.completion = val;
    }
    fill(el, suggestion) {
        // if (suggestion != undefined && this.active) {
        //     if (this.completion) {
        //         const prefix = el.value.split(" ").pop();
        //         suggestion = suggestion.substring(prefix.length);
        //     }
        //     this.lastWord = suggestion;
        //     el.value += suggestion;
        //     el.selectionStart = el.value.length - suggestion.length;
        //     el.selectionEnd = el.value.length;
        // }else{
        //     this.lastWord = '';
        // }
    }
    shortcutPressed(el){
        el.value = el.value.substring(0, el.value.length - this.lastWord.length);
    }
    keyPressed(key){
        this.active = key.length == 1;
    }
}

module.exports = Autofill;