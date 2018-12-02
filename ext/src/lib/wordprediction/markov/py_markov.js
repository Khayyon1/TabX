
const spawn = require("child_process").spawn;
var sugs;

function predictAndParse(word, callback) {
    const pythonProcess = spawn('python3',["word-prediction.py", word]);
    pythonProcess.stdout.on('data', (data) => {
        var predictions;
        for (var i = 0; i < data.length; i++) {
            predictions += String.fromCharCode(data[i]);
        }
        var suggestions = [];
        var word = "";
        for (var i = 0; i < predictions.length; i++) {
            if (/\s/.test(predictions[i]) && suggestions.length < 3) {
                if (suggestions.length === 0) {
                    word = word.substring(9);
                }
                suggestions.push(word);
                word = "";
            }
            else if (predictions[i].match(/[a-z]/i)) {
                word += predictions[i];
            }
        }
        sugs = suggestions;
    });
    pythonProcess.on('close', function(code) {
        return callback(sugs);
    });
}

function predictNextWord(word) {
    predictAndParse(word, function(result) { 
        console.log(sugs);
    });
}

predictNextWord("because");