// Import Test framework

var expect = require('expect.js');
const wordLocation = "sampleText/1-1000.txt";

const train = require("./trieModelTrain.js");
expect(train).not.to.be(null);


function simpleReadFileSync(filePath){

    var fs = require('fs');
    var options = {encoding:'utf-8', flag:'r'};
    var buffer = fs.readFileSync(filePath, options);
    return buffer.replace( /\n/g, " " ).split( " " );
}

wordList = simpleReadFileSync(wordLocation);
for(var i = 0; i < wordList.length; i++){
    var curNode = train.head;
    train.add(wordList[i], true);
    for(var j in wordList[i]){
        curNode = curNode.children[wordList[i][j].toLowerCase()];
        expect(curNode.key.toLowerCase()).to.be(wordList[i][j].toLowerCase());

    }
    expect(wordList[i].toLowerCase()).to.be(curNode.value)
}
