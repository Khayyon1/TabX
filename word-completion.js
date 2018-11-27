var levenshtein = require('fast-levenshtein')
//levenshtein-edit-distance

function simpleReadFileSync(filePath){
    var fs = require('fs');
      var options = {encoding:'utf-8', flag:'r'};
  
      var buffer = fs.readFileSync(filePath, options);
  
      return buffer;
}

var words = simpleReadFileSync('1-1000.txt');
words = words.replace( /\n/g, " " ).split( " " )

var word = "tw"
var recs = {}
for (var i = 0; i < words.length; i++) {
    if (words[i].substring(0, word.length) === word) {
        //put all words that start with a certain letter in dict
        recs[words[i]] = 1
    }
}

var i = 0
var maxDist = 0
var recsLen = Object.keys(recs).length
while ((maxDist !== 1 && i < words.length) || recsLen < 3) {
    if (!(words[i] in recs)) {
        var lev = levenshtein.get(word, words[i])
        if (recsLen < 3) {
            recs[words[i]] = lev
            if (lev > maxDist) {
                maxDist = lev
            }
        }
        else {
            if (lev < maxDist) {
                delete recs[Object.keys(recs).find(key => recs[key] === maxDist)]
                recs[words[i]] = lev
                maxDist = lev
            }
    }
    recsLen = Object.keys(recs).length
    }
    i++
}

//console.log(maxDist)
for (var key in recs) {
    console.log(key)
}