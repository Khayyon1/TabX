var lv = require('levenshtein-edit-distance')
var words;
// Reading data in utf-8 format
// which is a type of character set.
// Instead of 'utf-8' it can be
// other character set also like 'ascii'
/// write to file
var fs = require('fs');
function simpleReadFileSync(filePath)
{
    var options = {encoding:'utf-8', flag:'r'};

    var buffer = fs.readFileSync(filePath, options);

    return buffer;
}

function getNearest(testWord){
  var words = simpleReadFileSync('1-1000.txt');
  wordList = words.replace( /\n/g, " " ).split( " " )

  var first = ["Failed", 10]
  var second = ["Failed", 11]
  var third = ["Failed", 12]

  var currWord = testWord
  for (var i = 0; i < wordList.length; i++) {
      dist = lv(currWord, wordList[i])
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

console.log(getNearest("help"))
