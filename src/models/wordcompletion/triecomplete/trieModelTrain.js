//var expect = require('expect')
const wordLocation = "sampleText/1-5000.txt";

function simpleReadFileSync(filePath){

    var fs = require('fs');
    var options = {encoding:'utf-8', flag:'r'};
    var buffer = fs.readFileSync(filePath, options);
    return buffer.replace( /\n/g, " " ).split( " " );

}

var node = {
  key : null
  , value : null
  , children : []
}

function Trie() {
  	this.head = {
  			key : ''
  		, children: {}
        , length:  0
        ,value : ''
        ,valid : false
        ,closest: []
    };

}

Trie.prototype.import = function(wordLocation){
    let wordList = simpleReadFileSync(wordLocation);
    //console.log(wordList)
    for(var i = 0; i < wordList.length; i++){
        this.add(wordList[i], true)
    }
}

// Prototype adds a characteristic to the Trie, in this case it adds a function
Trie.prototype.add = function(key, validWord) {
    // key = key.toLowerCase();
    var firstNode = false;
    // Make a copy of key
    keyHold = JSON.parse(JSON.stringify(key));
    var curNode = this.head
    	, newNode = null
    	, curChar = key.slice(0,1)
        , parNode = this.head;
    key = key.slice(1);
	while(curNode.children[curChar] !== undefined && curChar.length > 0){
		curNode = curNode.children[curChar];
		curChar = key.slice(0,1);
		key = key.slice(1);
        firstNode = true;

	}
    if(curChar.length === 0){
        valid = true
    }

    //If the first letter is already used
    if (firstNode){
        parNode = curNode;
    }
	while(curChar.length > 0) {
		newNode = {
			key : curChar
            //places value of String if true, places undefined if not end of word
            , valid : (keyHold === (parNode.value + curChar)) && validWord
			, value : parNode.value + curChar
			, children: {}
            , length: parNode.length + 1
            , closest: []
		};
        parNode.children[curChar] = newNode;
		parNode = Object.assign({}, newNode);

        curChar = key.slice(0,1);
		key = key.slice(1);
	}
};
Trie.search = function(key) {
    //key = key.toLowerCase();
    keyHold = JSON.parse(JSON.stringify(key));
	var curNode = this.head
		, curChar = key.slice(0,1)
		, d = 0;

	key = key.slice(1);

	while(typeof curNode.children[curChar] !== "undefined" && curChar.length > 0){
		curNode = curNode.children[curChar];
		curChar = key.slice(0,1);
		key = key.slice(1);
		d += 1;
	}

	if (curNode.value !== undefined && key.length === 0) {
		return curNode;
	} else {
        er =  new Error('word "' + keyHold +'" does not exist'  );
        throw er
	}
};


Trie.prototype.save = function(importTrie){
    var util = require("util");
    console.log(util.inspect(importTrie, {showHidden: false, depth: null}));
}

Trie.prototype.addClosest = function(){
    var wordDistance = require('./testBetterModels/understandDM.js');
    var model = wordDistance.myTrain;
    newList = wordDistance.modelTrain(style = 'default');

    let wordList = simpleReadFileSync(wordLocation);
    model.addDictionary(wordList);

    var queue = [];
    queue.push(this.head);
    while(queue.length > 0){
         let tempNode = queue.shift();
         for (var key in tempNode.children){
             queue.push(tempNode.children[key]);
         }
         //console.log(tempNode.value)
         tempNode.closest = model.closestWords(tempNode.value,10)

         // if(arrayWords.length > 0){
         //     for(var i = 0; i < arrayWords.length; i++){
         //         tempNode.closest.push(arrayWords[i].term);
         //         if (i > 5){
         //             i = arrayWords.length
         //         }
         //     }
         //
         // }
    }
    //create queue
    //add head to queue
    //while queue is not empty
    //add children of currNode to queue
    //find closest words to current
}

var testTrie = new Trie();
module.exports = testTrie;

var realTrie = new Trie();

realTrie.import(wordLocation)
realTrie.addClosest()
//Coment this out to stop automatic.
//Use console command save > trieModel.js
realTrie.save(realTrie);
