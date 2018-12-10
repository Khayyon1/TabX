//var expect = require('expect')
const wordLocation = "sampleText/1-1000.txt";

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
    };

}

Trie.prototype.import = function(wordLocation){
    wordList = simpleReadFileSync(wordLocation)
    for(var i = 0; i < wordList.length; i++){
        this.add(wordList[i], true)
    }
}

// Prototype adds a characteristic to the Trie, in this case it adds a function
Trie.prototype.add = function(key, validWord) {
    key = key.toLowerCase();
    var firstNode = false;
    // Make a copy of key
    keyHold = JSON.parse(JSON.stringify(key));
    var curNode = this.head
    	, newNode = null
    	, curChar = key.slice(0,1)
        , parNode = this.head;
    key = key.slice(1);
	while(typeof curNode.children[curChar] !== "undefined"
		&& curChar.length > 0){

		curNode = curNode.children[curChar];
		curChar = key.slice(0,1);
		key = key.slice(1);
        firstNode = true;

	}
    if(curChar.length === 0){
        curNode.value = keyHold;
    }
    //If the first letter is already used
    if (firstNode){
        parNode = curNode;
    }

	while(curChar.length > 0) {
		newNode = {
			key : curChar
            //places value of String if true, places undefined if not end of word
			, value : key.length === 0 && validWord ? keyHold : undefined
			, children : {}
            , length: parNode.length + 1
		};
        parNode.children[curChar] = newNode;
		parNode = Object.assign({}, newNode);

        curChar = key.slice(0,1);
		key = key.slice(1);

	}
    if (parNode.value != undefined && parNode.value != null){
        if (parNode.value.length != parNode.length ){
                er =  new Error('length is wrong ' + parNode.value + " " + parNode.length );
                throw er
        }
    }

};
Trie.search = function(key) {
    key = key.toLowerCase();
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
        er =  new Error('word "' +keyHold +'" does not exist'  );
        throw er
	}
};


Trie.prototype.save = function(){
    var util = require("util");
    console.log(util.inspect(testTrie, {showHidden: false, depth: null}));
    console.log('module.exports = Trie')
}

var testTrie = new Trie()
module.exports = testTrie
// testTrie.import(wordLocation)

//Coment this out to stop automatic.
//Use console command save > trieModel.js
// testTrie.save();
