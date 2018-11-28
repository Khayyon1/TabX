

function simpleReadFileSync(filePath){
  var fs = require('fs');
    var options = {encoding:'utf-8', flag:'r'};

    var buffer = fs.readFileSync(filePath, options);

    return buffer;
}

function getNearest(testWord){
  // var lv = require('levenshtein-edit-distance')
  var lv = require('fast-levenshtein')
  var words = simpleReadFileSync('1-1000.txt');
  wordList = words.replace( /\n/g, " " ).split( " " )

  // Create top 3 words
  //TODO turn this into a faster list
  var first = ["Failed", 10]
  var second = ["Failed", 11]
  var third = ["Failed", 12]

  var currWord = testWord
  for (var i = 0; i < wordList.length; i++) {

      // When Switching from fast Levenshtein to levenshtein remove .get from line
      dist = lv.get(currWord, wordList[i])

      // Check
      if (dist < third[1]){
        if (dist < second[1]){
          if (dist < first[1]){
            first[0] = wordList[i]
            first[1] = dist
          }
          else{
            second[0] = wordList[i]
            second[1] = dist
          }
        }
        else {
          third[0] = wordList[i]
          third[1] = dist
        }
      }
  }
  return [first[0], second[0], third[0]]
}
//Test For unweighted closest words to 'help'
console.log(getNearest("help"))
