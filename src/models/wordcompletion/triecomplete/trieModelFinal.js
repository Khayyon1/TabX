var Trie = require('./trieModel.js');

Trie.add = function(key, validWord) {
    key = key.toLowerCase();
    var firstNode = false;
    // Make a copy of key
    keyHold = JSON.parse(JSON.stringify(key));
    var curNode = this.head
    	, newNode = null
    	, curChar = key.slice(0,1)
        , parNode = this.head;
    key = key.slice(1);
    console.log(validWord);
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
			, children : {}
            , length: parNode.length + 1
		};
        parNode.children[curChar] = newNode;
		parNode = Object.assign({}, newNode);

        curChar = key.slice(0,1);
		key = key.slice(1);

    };
}

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
}

Trie.getChildren = function(finalArray, total, curNode, ignore){
    var cQueue = []
    cQueue.push(curNode)

    // find current Value and nearest children.
    while (total > 0 && cQueue.length > 0){
        var tempNode = cQueue.shift();
        // console.log("Key " + tempNode.key);
        // console.log("value " + tempNode.value);

        if (tempNode.value !== undefined && tempNode.valid){
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
Trie.getSuggestion = function(key){
    var finalArray = this.getWordCompletion(key);

    if (finalArray[0].length < 3){
        finalArray = this.getCorrectSuggestion(key);
    }
    return finalArray[0,3]


}

Trie.getCorrectionSuggestions = function(key){

    this.add(key, false)
    keyHold = JSON.parse(JSON.stringify(key));
    var total = 3;
    var finalArray = new Array();
    var curNode = this.head;
  	var curChar = key.slice(0,1);
    var cQueue = []
    key = key.slice(1);

    //Node Stack to keep track
    var nodeStack = []
    //findNode

    while(typeof curNode.children[curChar] !== "undefined" && curChar.length > 0){
        nodeStack.push(curNode)
        //Traverse 1 layer down the tree
        curNode = curNode.children[curChar];
        //add next character
        curChar = key.slice(0,1);
        //remove 1 character from key
        key = key.slice(1);
    }
    if (curNode.closest !== undefined){
        if (curNode.closest.length > total){
            console.log(curNode.closest.slice(0,3))
            return curNode.closest.slice(0,3);
        }
        else{
            finalArray = curNode.closest;
            total -= curNode.closest.length;
        }
    }


    //This checks Stores each letter in prediction word
    var cStack = []
    for (var i in keyHold){
        cStack.push(keyHold[i])
    }
    //cStack.push("");
    //nodeStack.pop();
    while(nodeStack.length > 0 && total > 0){
        tempArrayChild = this.getChildren(finalArray,total, nodeStack.pop(), cStack.pop() );
        finalArray = tempArrayChild[0]
        total = tempArrayChild[1]
    }

    return finalArray
}

Trie.getWordCompletion = function(key){
    this.add(key, false)
    keyHold = JSON.parse(JSON.stringify(key));
    var total = 3;
    var finalArray = new Array();
    var curNode = this.head;
    var curChar = key.slice(0,1);
    var cQueue = []
    key = key.slice(1);

    //Node Stack to keep track
    var nodeStack = []
    //findNode

    while(typeof curNode.children[curChar] !== "undefined" && curChar.length > 0){
        nodeStack.push(curNode)
        //Traverse 1 layer down the tree
        curNode = curNode.children[curChar];
        //add next character
        curChar = key.slice(0,1);
        //remove 1 character from key
        key = key.slice(1);
    }
    nodeStack.push(curNode)
    //This checks Stores each letter in prediction word
    var cStack = []
    for (var i in keyHold){
        cStack.push(keyHold[i])
    }
    cStack.push("");
    tempArrayChild = this.getChildren(finalArray,total, nodeStack.pop(), cStack.pop());
    finalArray = tempArrayChild[0]
    total = tempArrayChild[1]


    return finalArray
}

Trie.remove = function(key) {
    key = key.toLowerCase();
	var d = this.search(key);
    	if (d > -1){
    		removeH(this.head, key, d);
    	}
}

Trie.predictCurrentWord = Trie.getCorrectionSuggestions;

module.exports = Trie
