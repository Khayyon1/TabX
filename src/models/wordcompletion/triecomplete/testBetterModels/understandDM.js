

'use strict';

const addBegW = 0.6;
const addEndW = 0.2;
const addMidW = 0.3;
const subGenW = 1.3;
const swapGenW = 1;
//export addW, addEndW, addMidW, subW, swapW};

// Initialize the Matrix of Values
//Fill matrix with outside edge of values
function initMatrix(write, guess) {
    if (undefined == write || undefined == guess) {
        return null;
    }

    let d = [];
    for (let i = 0; i <= write.length; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (let j = 0; j <= guess.length; j++) {
        d[0][j] = j;
    }
    return d;
}

//Get Distance between to strings
function distance(write, guess) {


    //if either value is not a string return undefined
    if (undefined == write || undefined == guess || 'string' !== typeof write
            || 'string' !== typeof guess) {
        return -1;
    }

    //create Matrix
    let d = initMatrix(write, guess);

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
        let addTo;
        //let addToWrite;
        for (let writeIdx = 1; writeIdx <= write.length; writeIdx++) {
            if (totalEqual >= write.length){
                addTo = addEndW;
            }
            else if(totalEqual > 0 && totalEqual < write.length){
                addTo = addMidW;
            }
            else if(totalEqual === 0){
                addTo =  addBegW
            }
            else{
                throw "Something is wrong is total Equal"
            }

            //Do we Need to Do a substitution
            if (guess.charAt(guessIdx - 1) === write.charAt(writeIdx - 1)) {
                cost = 0;
                totalEqual += 1;
            }

            else {
                cost = subGenW;
            }

            //Min of one more  +1 on either
            //min of One fewer + both.
            d[writeIdx][guessIdx] = Math.min.apply(null, [
                //Addition
                d[writeIdx - 1][guessIdx] + addTo,
                d[writeIdx][guessIdx - 1] + addTo,
                //Substitution
                d[writeIdx - 1][guessIdx - 1] + cost
            ]);

            //Damerau Check
            if (writeIdx > 1 && guessIdx > 1 && write[writeIdx - 1] === guess[guessIdx - 2]
                 && write[writeIdx - 2] === guess[guessIdx - 1]) {
                //set the location on the matrix to the minimum of it's current value
                //and two prior + cost
                d[writeIdx][guessIdx] = Math.min.apply(null, [
                    d[writeIdx][guessIdx],
                    d[writeIdx - 2][guessIdx - 2] + swapGenW
                ]);
                totalEqual += 2;
            }
        }
    }
    return d[write.length][guess.length];
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
module.exports = {
    addBegW: addBegW,
    addEndW: addEndW,
    addMidW: addMidW,
    subGenW: subGenW,
    swapGenW: swapGenW,

    distance: distance
}
exports.distanceProm = distanceProm;
exports.distance = distance;
exports.minDistanceProm = minDistanceProm;
