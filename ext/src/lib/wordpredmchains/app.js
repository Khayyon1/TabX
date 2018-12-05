var nlp = require('./nlp_compromise.min')
const txt = require('./text')

var tokens = [];

function createTokens() {
    var nlp_text = nlp.text(txt);
    var terms = nlp_text.terms();
    for (var i = 0; i < terms.length; i++) {
        tokens.push(terms[i].text);
    }
}

function chooseStartingToken() {
    var index = Math.floor(Math.random() * tokens.length);
    return tokens[index];
}

function findNextWord(currentWord) {
    var nextWords = [];
    for (var w = 0; w < tokens.length - 1; w++) {
        if (tokens[w] == currentWord) {
            nextWords.push(tokens[w + 1]);
        }
    }
    console.log(currentWord, nextWords)
    var word = nextWords[Math.floor(Math.random() * nextWords.length)]; // choose a random next word
    return word;
}


function start() {
    createTokens();
    var currentWord = chooseStartingToken();
    var sentence = currentWord + " ";
    while (currentWord.indexOf(".") < 0) { // while we haven't found a period
        currentWord = findNextWord(currentWord);
        sentence += currentWord + " ";
    }
    console.log(sentence);
}
start();