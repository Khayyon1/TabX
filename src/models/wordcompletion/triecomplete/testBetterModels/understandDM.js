

'use strict';

// Initialize the Matrix of Values
//Fill matrix with outside edge of values
function initMatrix(s1, s2) {
    if (undefined == s1 || undefined == s2) {
        return null;
    }

    let d = [];
    for (let i = 0; i <= s1.length; i++) {
        d[i] = [];
        d[i][0] = i;
    }
    for (let j = 0; j <= s2.length; j++) {
        d[0][j] = j;
    }
    console.log(d)
    return d;
}


function damerau(i, j, s1, s2, d, cost) {
    if (i > 1 && j > 1 && s1[i - 1] === s2[j - 2] && s1[i - 2] === s2[j - 1]) {
        d[i][j] = Math.min.apply(null, [
            d[i][j],
            d[i - 2][j - 2] + cost
        ]);
    }
}

//Get Distance between to strings
function distance(s1, s2) {
    //if either distance is undefined. then
    if (undefined == s1 || undefined == s2 || 'string' !== typeof s1
            || 'string' !== typeof s2) {
        return -1;
    }

    let d = initMatrix(s1, s2);
    if (null === d) {
        return -1;
    }
    for (var i = 1; i <= s1.length; i++) {
        let cost;
        for (let j = 1; j <= s2.length; j++) {
            if (s1.charAt(i - 1) === s2.charAt(j - 1)) {
                cost = 0;
            } else {
                cost = 1;
            }

            d[i][j] = Math.min.apply(null, [
                d[i - 1][j] + 1,
                d[i][j - 1] + 1,
                d[i - 1][j - 1] + cost
            ]);

            damerau(i, j, s1, s2, d, cost);
        }
    }

    return d[s1.length][s2.length];
}


function distanceProm(s1, s2) {
    return new Promise((resolve, reject) => {
        let result = distance(s1, s2);
        if (0 <= result) {
            resolve(result);
        } else {
            reject(result);
        }
    });
}

function minDistanceProm(s1, list) {
    return new Promise((resolve, reject) => {
        if (undefined == list || !Array.isArray(list)) {
            reject(-1);
        } else if (0 === list.length) {
            resolve(distance(s1, ''));
        }

        let min = -2;

        list.forEach((s2) => {
            let d = distance(s1, s2);
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

console.log(distance('cat', 'act' ))
exports.distanceProm = distanceProm;
exports.distance = distance;
exports.minDistanceProm = minDistanceProm;
