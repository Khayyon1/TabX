const fs = require('fs');
const nlp = require('./nlp_compromise.min');
const txt = require('./nyt_headlines');

const nlp_text = nlp.text(txt);
let tokens = [];
var terms = nlp_text.terms();
for (var i = 0; i < terms.length; i++) {
    tokens.push(terms[i].text);
}

let writeStream = fs.createWriteStream('tokens.js');

writeStream.write('const tokens = [')
tokens.forEach((el) => {
    writeStream.write("'"+el+"',");
})
writeStream.write('] \n module.exports = tokens;')
writeStream.on('finish', () => {
    console.log('wrote all data to file');
});

// close the stream
writeStream.end(); 