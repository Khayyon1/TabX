const nlp = require('./nlp_compromise.min')
const txt = require('./text')

class WordPrediction{
    constructor(){
        this.tokens = [];
    }
    createTokens() {
        this.nlp_text = nlp.text(txt);
        var terms = this.nlp_text.terms();
        for (var i = 0; i < terms.length; i++) {
            this.tokens.push(terms[i].text);
        }
    }
    chooseStartingToken() {
        var index = Math.floor(Math.random() * this.tokens.length);
        return this.tokens[index];
    }
    findNextWordL(currentWord) {
        var nextWords = [];
        for (var w = 0; w < this.tokens.length - 1; w++) {
            if (this.tokens[w] == currentWord) {
                nextWords.push(this.tokens[w + 1]);
            }
            if (nextWords.length == 4) break;
        }
        var word = nextWords[Math.floor(Math.random() * nextWords.length)]; // choose a random next word
        return word;
    }
    findNextWord(currentWord) {
        var nextWords = [];
        for (var w = 0; w < this.tokens.length - 1; w++) {
            if (this.tokens[w] == currentWord) {
                this.addPossibleNextWord(nextWords, this.tokens[w + 1]);
            }
            if (nextWords.length == 4) break;
        }
        return nextWords;
    }
    addPossibleNextWord(nextWords, word){
        nextWords.forEach((n_word) => {
            if (n_word == word) return;
        });
        nextWords.push(word);
    }
    sentenceGeneration() {
        this.createTokens();
        var currentWord = this.chooseStartingToken();
        var sentence = currentWord + " ";
        while (currentWord.indexOf(".") < 0) { // while we haven't found a period
            currentWord = this.findNextWord(currentWord);
            sentence += currentWord + " ";
        }
        console.log(sentence);
    }
    predict(seed){
        const next_words = this.findNextWord(seed);
        console.log(next_words);
    }
}

const model = new WordPrediction();
model.createTokens();
model.predict("you");
