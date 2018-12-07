

function readAndParse(filePath) {
    var fs = require('fs');
    var options = {encoding:'utf-8', flag:'r'};
    var buffer = fs.readFileSync(filePath, options);
    //var dictionary = buffer.replace( /\n/g, " " ).split( " " ); // For Russell's computer
    var words = buffer.replace( /\n/g, " " ).split( "\r " ); 

    var a = 97;
    var dictionary = {};
    for (var i = 0; i < 26; i++) {
        dictionary[String.fromCharCode(a + i)] = [];
    }
    for (var i = 0; i < words.length; i++) {
        var lower = words[i].toLowerCase();
        var wordList = dictionary[lower.charAt(0)];
        wordList.push(lower);
        dictionary[lower.charAt(0)] = wordList;
    }
    return dictionary;
}

function searchForAdditions(word, dictionary, recs) {
    var i = 0;
    while (Object.keys(recs).length < 3) {
        if (dictionary[i].substring(0, word.length) === word) {     
            recs[dictionary[i]] = 1;
        }
       i++; 
    }
    return recs
}

function searchForReplacements(word, dictionary, recs) {
    var i = 0;
    var maxDist = 0;
    var recsLen;
    var levenshtein = require('fast-levenshtein');

    while ((maxDist !== 1 && i < dictionary.length) ||  (recsLen = Object.keys(recs).length) < 3) { 
        if (!(dictionary[i] in recs)) {
            var lev = levenshtein.get(word, dictionary[i]);
            if (recsLen < 3) {
                recs[dictionary[i]] = lev;
                if (lev > maxDist) {
                    maxDist = lev;
                }
            }
            else {
                if (lev < maxDist) {
                    delete recs[Object.keys(recs).find(key => recs[key] === maxDist)];
                    recs[dictionary[i]] = lev;
                    maxDist = lev;
                }
            }
        }
        i++;
    }
    return recs;
}

function findCompleteWordOptions(word) {
    var dictionary = readAndParse('1-1000.txt');
    var recs = {};

    word = word.toLowerCase();
    dictionary = dictionary[word.charAt(0)];
    recs = searchForAdditions(word, dictionary, recs);
    recs = searchForReplacements(word, dictionary, recs);
    
    return Object.keys(recs);
}
