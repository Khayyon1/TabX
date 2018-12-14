var expect = require('expect.js');
//Import trieModelFinal
const train = require("./trieModelFinal.js");
const mispellLocation = "sampleText/commonMispellings.txt";

function intersect_arrays(a, b) {
    var sorted_a = a.concat().sort();
    var sorted_b = b.concat().sort();
    var common = [];
    var a_i = 0;
    var b_i = 0;
    while (a_i < a.length
           && b_i < b.length)
    {
        if (sorted_a[a_i] === sorted_b[b_i]) {
            common.push(sorted_a[a_i]);
            a_i++;
            b_i++;
        }
        else if(sorted_a[a_i] < sorted_b[b_i]) {
            a_i++;
        }
        else {
            b_i++;
        }
    }
    return common;
}

//Test Word Completion
for (let i =0; i < 50; i++){
    let r = Math.random().toString(36).substring(2,5);
    r = r.replace(/[0-9]/g, '');
    var tempArray = train.getWordCompletion(r);
    if (r !== ""){
        for(let j = 0; j < tempArray.length; j++){
            expect(tempArray[j].substring(0,r.length)).to.be(r)
        }
    }
}

//Import
var fs = require('fs');
var options = {encoding:'utf-8', flag:'r'};
var buffer = fs.readFileSync(mispellLocation, options);
buffer = buffer.replace( /\n/g, "$" ).split("$");


var score = 0.0
for(let i = 0; i < buffer.length-1; i++){
    let regex = /^([\w. '-]+)->([\w. ']+)(?:\, ([\w. '-]+))?/g;
    var match = regex.exec(buffer[i]);


    let sugg = train.getCorrectionSuggestions(match[1]);

    let tempArray = [];
    tempArray.push(match[2]);
    if (match[3] !== undefined){
        tempArray.push(match[3]);
    }

    if(intersect_arrays(sugg, tempArray).length > 0){
        score++;
        console.log(sugg, tempArray);
    }
}

console.log("score ", score*100/ buffer.length)
