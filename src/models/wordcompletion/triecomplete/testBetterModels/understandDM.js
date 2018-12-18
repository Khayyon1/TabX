
//Make sure to cite https://www.wordfrequency.info/


'use strict';


///Sub Should Never Be more than delete + Add
const addBegW = 0.9;
const addMidW = 1.0;
const addEndW = 0;

const delBegW = 2;
const delMidW = 1.1;
const delEndW = 0.5;

const subGenW = 2;
const swapGenW = 0.4;
const typeArray = ["addBeg", "addMid", "addEnd",
        "delBeg", "delMid", "delEnd",
        "subGen", "swapGen"]
//export addW, addEndW, addMidW, subW, swapW};

// Initialize the Matrix of Values
//Fill matrix with outside edge of values

//TODO make customizable weights.

function modelTrain(style = 'default', addBeg = addBegW, addMid = addMidW,
 addEnd = addEndW, delBeg = delBegW,
 delMid = delMidW, delEnd = delEndW,
 subGen = subGenW, swapGen = swapGenW){

     //TODO deal with numbers
    this.buildModel = function(arrayVal = [addBeg, addMid, addEnd,
            delBeg, delMid, delEnd,
            subGen, swapGen]){
        let charArray = [" ", "-", "'",];
        for(let i = 0; i < 27; i++){
        //Iterate over every character in english alphabet
            charArray.push(String.fromCharCode(97 + i));
        }
        var values = {};
        for(let i = 0; i < typeArray.length; i++){
            values[typeArray[i]] = {}
            if (typeArray[i] === 'swapGen' || typeArray[i] === 'subGen'){
                for(let j = 0; j < charArray.length; j++){
                    let tempDict = {}
                    values[typeArray[i]][charArray[j]] = tempDict
                    for (let k = 0; k < charArray.length; k++){
                        if (charArray[k] !== charArray[j]){
                            values[typeArray[i]][charArray[j]][charArray[k]] = arrayVal[i];
                        }
                    }
                }
            }
            else{
                for(let j = 0; j < charArray.length; j++){
                    values[typeArray[i]][charArray[j]] = arrayVal[i]
                }
            }
        }

        return values
    }

    if (style === 'default' || style === 'custom'){
        this.model = this.buildModel([addBeg, addMid, addEnd,
                delBeg, delMid, delEnd,
                subGen, swapGen]);
    }

    else if (style === 'even'){
        this.model = this.buildModel(arrayVal = [1, 1, 1,
                1, 1, 1,
                1, 1]);
    }
    // console.log("model____")
    // console.log(this.model['addEnd']['a']);
    // console.log("Model____")
}


modelTrain.prototype.changeValue = function(type = 'swapGen', newValue, value1, value2){
    if (value1 !== undefined && value2 !== undefined){
        if(type === 'swapGen' || type === 'subGen'){
            if(this.model[type][value1][value2] !== undefined){
                this.model[type][value1][value2] = newValue;
                this.model[type][value2][value1] = newValue;

            }
            else{
                throw value1 + " or " + value2 + "Are not valid characters";
            }
        }
        else{
            throw "Please use the proper number of values";
        }
    }
    else if (value1 !== undefined){

        if(this.model[type][value1] !== undefined){
            this.model[type][value1] = newValue;
        }
        else{
            throw value1 + " is not valid characters";
        }
    }
    else{
        throw "please insert all values";
    }

    //this.model[type][]
}
         //Also need to iterate over space and Dash


modelTrain.prototype.initMatrix = function(write, guess) {
    if (undefined == write || undefined == guess) {
        return null;
    }
    // var beg = 100
    // var end = 100
    // //Rough Fix:
    //
    // for(let q = 0; q < write.length; q++){
    //     for(let r = 0; r < guess.length; r++){
    //         if (write[q] === guess[r]){
    //             beg = r;
    //             q = write.length + 1;
    //         }
    //     }
    //
    // }

    let d = [[0]];
    for (let i = 1; i <= write.length; i++) {
        d[i] = [];
        d[i][0] = d[i-1][0]+this.model['delBeg'][write[i-1]];
    }
    for (let j = 1; j <= guess.length; j++) {
        d[0][j] = d[0][j-1]+this.model['addBeg'][guess[j-1]];
    }
    return d;
}

//Get Distance between to strings
modelTrain.prototype.distance = function(write, guess) {
    write = write.toLowerCase();
    guess = guess.toLowerCase();
    //if either value is not a string return undefined
    if (undefined == write || undefined == guess || 'string' !== typeof write
            || 'string' !== typeof guess) {
        return -1;
    }

    //create Matrix
    let d = this.initMatrix(write, guess);

    //if both string length 0, return -1
    if (null === d) {
        return -1;
    }

    //Total Sum:
    let weightedValue = 0;

    //for the each combination of words in value
    let totalEqual = 0;
    for (var guessIdx = 1; guessIdx <= guess.length; guessIdx++) {
        let cost;
        let currAdd;
        let currDel;
        //let addToWrite;
        for (let writeIdx = 1; writeIdx <= write.length; writeIdx++) {
            // console.log(writeIdx)
            // console.log(write[writeIdx])
            //if no Similarities occur between write and guess
            if(totalEqual === 0){
                currAdd = 'addBeg';
                currDel = 'delBeg';
            }
            //if few similarities occur between write and guess
            else if(totalEqual > 0 && totalEqual < write.length){
                currAdd = 'addMid';
            }
            //if write is entirely contained within guess
            else if (totalEqual >= write.length){
                currAdd = 'addEnd';
            }

            // else{
            //     throw "1 Something is wrong is total Equal" + totalEqual
            // }
            if(totalEqual > 0 && totalEqual < guess.length){
                currDel = 'delMid';
            }
            //if write is entirely contained within guess
            else if (totalEqual >= guess.length){
                currDel = 'delEnd';
            }
            // else if (totalEqual > guess.length){
            //     throw "2 Something is wrong is total Equal" + totalEqual
            // }

            //Do we Need to Do a substitution
            if (guess.charAt(guessIdx - 1) === write.charAt(writeIdx - 1)) {
                cost = 0;
                totalEqual += 1;
            }

            else {
                // console.log(write.charAt(writeIdx - 1));
                // console.log(guess.charAt(guessIdx - 1));
                // console.log(this.model['subGen'][write.charAt(writeIdx - 1)])
                //console.log(write);
                cost = this.model['subGen'][write.charAt(writeIdx - 1)][guess.charAt(guessIdx - 1)];
                // console.log(cost);
            }

            //Min of one more  +1 on either
            //min of One fewer + both.
            if (typeof this.model[currDel][write[writeIdx -1]] !== 'number'){
                // console.log(currDel);
                // console.log(this.model[currDel]);
                throw "error " + currDel
            }

            if (typeof this.model[currAdd][guess[guessIdx -1]] !== 'number'){
                //console.log(this.model);
                console.log(currAdd)
                // console.log(this.model[currAdd])
                // console.log(guessIdx -1)
                // console.log(guess.charAt(3))
                //console.log(this.model[currAdd][])
                throw "error " + this.model[currAdd][guess[guessIdx -1]] + " " + write + guess
            }

            d[writeIdx][guessIdx] = Math.min.apply(null, [
                //Addition
                d[writeIdx - 1][guessIdx] + this.model[currDel][write[writeIdx -1]],
                d[writeIdx][guessIdx - 1] + this.model[currAdd][guess[guessIdx -1]],
                //Substitution
                d[writeIdx - 1][guessIdx - 1] + cost
            ]);
            //console.log("cost " +cost)

            //Damerau Check
            if (writeIdx > 1 && guessIdx > 1 && write[writeIdx - 1] === guess[guessIdx - 2]
                 && write[writeIdx - 2] === guess[guessIdx - 1]) {
                //set the location on the matrix to the minimum of it's current value
                //and two prior + cost
                d[writeIdx][guessIdx] = Math.min.apply(null, [
                    d[writeIdx][guessIdx],
                    d[writeIdx - 2][guessIdx - 2] + this.model['swapGen'][write[writeIdx - 1]][guess[guessIdx - 1]]
                ]);
                totalEqual += 2;
            }
            //console.log(d[writeIdx][guessIdx])
        }

    }
    //console.log(d)
    return d[write.length][guess.length];
}
modelTrain.prototype.addDictionary = function(dictionary){
    this.dictionary = dictionary;
}
modelTrain.prototype.closestWords = function(word,number, weighted){
    var closest = new Array(number);
    for(let i =0; i < number; i++){
        closest[i] = ['BLANK', Number.MAX_SAFE_INTEGER];
    }

    for(let i = 0; i < this.dictionary.length; i++){
        let dist = this.distance(word ,this.dictionary[i].toLowerCase());
        if (dist < closest[number-1][1]){
            for (var j = number-2; j >= 0; j--){
                if (dist > closest[j][1]){
                    closest.splice(j+1, 0, [this.dictionary[i], dist]);
                    j = -2;
                }
            }
            if(j === -1){

                closest.splice(0, 0, [this.dictionary[i], dist])
            }
            closest.pop();
        }
    }

    if (weighted === true){
        return(closest);
    }
    else{
        let tempClosest = [];
        for(let i = 0; i < number; i ++){
            tempClosest.push(closest[i][0]);
        }
        return tempClosest
    }

}


function distanceProm(write, guess) {
    return new Promise((resolve, reject) => {
        let result = distance(write, guess);
        if (0 <= result) {
            resolve(result);
        } else {
            reject(result);
        }
    });
}

function minDistanceProm(write, list) {
    return new Promise((resolve, reject) => {
        if (undefined == list || !Array.isArray(list)) {
            reject(-1);
        } else if (0 === list.length) {
            resolve(distance(write, ''));
        }

        let min = -2;

        list.forEach((guess) => {
            let d = distance(write, guess);
            if (-2 === min || d < min) {
                min = d;
            }
        });

        if (0 <= min) {
            resolve(min);
        } else {
            reject(min);
        }
    });
}
var myTrain = new modelTrain();
module.exports = {
    addBegW: addBegW,
    addEndW: addEndW,
    addMidW: addMidW,
    subGenW: subGenW,
    swapGenW: swapGenW,
    delBegW : delBegW,
    delMidW : delMidW,
    delEndW : delEndW,
    myTrain: myTrain,
    modelTrain: modelTrain
}


exports.distanceProm = distanceProm;
//exports.distance = distance;
exports.minDistanceProm = minDistanceProm;
