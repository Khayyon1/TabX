console.log("Start")
var Trie = require('./trieModel');






Trie.add = function(key, validWord) {
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
        firstNode = true;

	}
    //If the first letter is already used
    if (firstNode){
        parNode = curNode;
    }

	while(curChar.length > 0) {
        // console.log("key " + key + " Slice " + curChar)
		newNode = {
			key : curChar
            //places value of String if true, places undefined if not end of word
			, value : key.length === 0 && validWord === true ? keyHold : undefined
			, children : {}
            , length: parNode.length + 1
		};
        parNode.children[curChar] = newNode;
		parNode = Object.assign({}, newNode);

        curChar = key.slice(0,1);
		key = key.slice(1);

	}
    // if (parNode.value != undefined && parNode.value != null){
    //     if (parNode.value.length != parNode.length ){
    //             er =  new Error('length is wrong ' + parNode.value + " " + parNode.length );
    //             throw er
    //     }
    // }

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
}

Trie.getChildren = function(finalArray, total, curNode, ignore){
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

Trie.getSuggestion = function(key){
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
                tempArrayChild = this.getChildren(finalArray,total, curNode, cStack.pop());
                finalArray = tempArrayChild[0]
                total = tempArrayChild[1]
    }
    return finalArray
}
Trie.remove = function(key) {
    key = key.toLowerCase();
	var d = this.search(key);
    	if (d > -1){
    		removeH(this.head, key, d);
    	}
}


console.log(Trie.getSuggestion("The"))