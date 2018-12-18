
class AbbreviationExpansion {
    constructor() {
        this.abbreviations = {"bc":"because", "tbh":"to be honest", "omw":"on my way", "idk":"i don't know", "nbd":"no big deal", 
                               "wip":"work in progress", "iirc":"if i recall correctly", "wtg":"way to go", "wdym":"what do you mean", 
                               "np":"no problem", "b/c":"because", "pov":"point of view", "wb":"welcome back", "mb":"my bad", "w/":"with", 
                               "w/o":"without", "thru":"through", "yk":"you know", "ily":"i love you", "ik":"i know", "ikr":"i know, right", 
                               "nvm":"nevermind", "lmk":"let me know", "brb":"be right back", "btw":"by the way", "irl":"in real life", 
                               "jk":"just kidding"};
    }

    expand(inputStr) {
        var splitStr = inputStr.split(/\s+/);
        var incompleteWord;
        
        if (splitStr[splitStr.length - 1] === "") {
            incompleteWord = splitStr[splitStr.length - 2];
        }
        else {
            incompleteWord = splitStr[splitStr.length - 1];
        }

        if (incompleteWord.toLowerCase() in this.abbreviations) {
            return this.abbreviations[incompleteWord.toLowerCase()];
        }
        else {
            return "";
        }
    }
}
