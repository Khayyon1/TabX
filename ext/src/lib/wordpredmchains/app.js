const nlp = require('./nlp_compromise.min')
const txt = require('./nyt_headlines')

class WordPrediction{
    constructor(){
        this.tokens = [];
    }
    createTokens() {
        setTimeout(() => {
            this.nlp_text = nlp.text(txt);
            var terms = this.nlp_text.terms();
            for (var i = 0; i < terms.length; i++) {
                this.tokens.push(terms[i].text);
            }
        }, 1)
    }
    findNextWord(currentWord) {
        let nextWords = [];
        for (let w = 0; w < this.tokens.length - 1; w++) {
            if (this.tokens[w] == currentWord) {
                this.addPossibleNextWord(nextWords, this.tokens[w + 1]);
            }
            if (nextWords.length == 4) break;
        }
        return nextWords;
    }
    predict(seed) {
        const last_word = seed.split(" ").pop()
        const next_words = this.findNextWord(last_word.toLowerCase());
        return next_words;
    }
    addPossibleNextWord(nextWords, word){
        let addWord = true;
        nextWords.forEach((n_word) => {
            if (n_word == word) addWord = false;
        });
        if(addWord) nextWords.push(word);
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
}

const model = new WordPrediction();
module.exports = model;