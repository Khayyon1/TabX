

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
    };
}

// Prototype adds a characteristic to the Trie, in this case it adds a function
Trie.prototype.add = function(key, validWord) {

    key = key.toLowerCase();
    var firstNode = false;
    // Make a copy of key
    keyHold = JSON.parse(JSON.stringify(key));
    //See if it works
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
        firstNode = true
	}
    //If the first letter is already used
    if (firstNode){
        parNode = curNode
    }
	while(curChar.length > 0) {

		newNode = {
			key : curChar
        //places value of String if true, places undefined if not end of word
			, value : key.length === 0 && validWord ? keyHold : undefined
			, children : {}
      , parent : parNode
		};
        //console.log("first New Node, " + keyHold + " " + newNode.parent.key)
		curNode.children[curChar] = newNode;
        parNode = curNode;
		curNode = newNode;
		curChar = key.slice(0,1);
		key = key.slice(1);
	}
};

Trie.prototype.search = function(key) {
  key = key.toLowerCase();

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
		return d;
	} else {
		return -1;
	}
}

Trie.prototype.getChildren = function(finalArray, total, curNode, ignore){
    var cQueue = []
    cQueue.push(curNode)

    // find current Value and nearest children.
    while (total > 0 && cQueue.length > 0){
        var tempNode = cQueue.shift();
        // console.log("Key " + tempNode.key);
        // console.log("value " + tempNode.value);

        if (tempNode.value !== undefined){
            finalArray.push(tempNode.value)
            total --;
        }
        for (var key in tempNode.children){
            if (key != ignore){
                cQueue.push(tempNode.children[key])
            }

        }
    }
    return [finalArray, total]
}

Trie.prototype.getSuggestion = function(key){
    this.add(key, false)
    key = key.toLowerCase();
    keyHold = JSON.parse(JSON.stringify(key));
    var total = 3;
    var finalArray = new Array();
    var curNode = this.head;
  	var curChar = key.slice(0,1);
    var cQueue = []
    key = key.slice(1);

    //findNode
    while(typeof curNode.children[curChar] !== "undefined" && curChar.length > 0){

        //Traverse 1 layer down the tree
        curNode = curNode.children[curChar];
        //add next character
        curChar = key.slice(0,1);
        //remove 1 character from key
        key = key.slice(1);
    }

    if (total > 0){
        var cQueue = []
            cQueue.push(curNode);
    //This checks each word one away from the length of the word
        var cStack = []
        //TODO MAKE THIS NEATER
        for (var i in keyHold){
            cStack.push(keyHold[i])
        }

        while (total > 0 && cQueue.length > 0 && curNode.parent !== undefined){
                tempArrayChild = this.getChildren(finalArray,total, curNode, cStack.pop());
                finalArray = tempArrayChild[0]
                total = tempArrayChild[1]
                curNode = curNode.parent
            }
    }
    return finalArray
}

Trie.prototype.remove = function(key) {
    key = key.toLowerCase();
	var d = this.search(key);
    	if (d > -1){
    		removeH(this.head, key, d);
    	}
}

var testTrie = new Trie()
wordList = simpleReadFileSync("1-1000.txt")
for(var i = 0; i < wordList.length; i++){
    testTrie.add(wordList[i], true)
}
