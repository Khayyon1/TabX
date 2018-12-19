var Trie = require('./trieModel.js');

//Takes in a full String, Returns the final word
Trie.getFinalWord = function(string){
    let regex = /(?:[^\s]+\s)*?([^\s]+)$/gm;
    let match = regex.exec(string);

    return match[1]
}


Trie.add = function(key, validWord) {
    key = key.toLowerCase();
    var firstNode = false;
    // Make a copy of key
    keyHold = JSON.parse(JSON.stringify(key));

    var curNode = Trie.head
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

Trie.getCorrectionSuggestions = function(key){
    console.log(key)
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
            //console.log(curNode.closest.slice(0,3))
            return curNode.closest.slice(0,total);
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
Trie.getSuggestion = function(key){

    var number = 3;
    var capitol = false;
    var capsLock = false;

    //if first letter is capital
    if (key.charAt(0) === key.charAt(0).toUpperCase()){
        if (key.length === 1){
            console.log("first Capitol")
            capitol = true;
        }
        else if (key.charAt(1) === key.charAt(1).toUpperCase()){
            console.log("capslock")
            capsLock = true;
        }
        else{
            console.log("Here")
            capitol = true;
        }

    }
    key = key.toLowerCase()
    //if the first and second letters are capitol


    //TODO, clean up this arrangement
    var finalArray = this.getCorrectionSuggestions(key);

    if (finalArray.length < number){
        finalArray.concat(this.getWordCompletion(key));
    }

    console.log(finalArray)
    for (let i = 0; i < finalArray.length; i++){
        if(capitol){

            finalArray[i] = finalArray[i].charAt(0).toUpperCase() + finalArray[i].slice(1);
        }
        else if(capsLock){

            finalArray[i] = finalArray[i].toUpperCase();
        }
    }
    console.log(finalArray)
    return finalArray


}
Trie.remove = function(key) {
    key = key.toLowerCase();
	var d = this.search(key);
    	if (d > -1){
    		removeH(this.head, key, d);
    	}
}

Trie.predictCurrentWord = Trie.getWordCompletion;

//module.exports = getFinalWord;
module.exports = Trie;
