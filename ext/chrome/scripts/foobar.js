import {activeElementIsTextField, getCurrentWord} from "./currentword"
let _current_word = "";

document.addEventListener("keyup", currentword.storeCurrentWord);

function storeCurrentWord(){
    if(activeElementIsTextField())
    {
        _current_word = getCurrentWord(document.activeElement);
        console.log(_current_word);
    }
}
