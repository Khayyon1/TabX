# Next Word Prediction Module

### Used Borwserify to bundle files. Hence, `bundle.js` is the only file one needs for the usage. Read the code and comments provided below in `Usage` section carefully.

### Usage:
```js
// import an instance of next word predictor
let nn = require('.ext/src/lib/nn_wordprediction/dist/bundle.js');
// seed text should be last 3 or 4 words a user has written so far
let seed_text = "Yesterday I"
// predict function returns an array of 4 possible next words
// NOTE: it is an asynchronous function that uses a promise to return a value.
// Hence, use the `then` syntax as shown below.
nn.predict(seed_text).then((pred) => {
  console.log(pred);
});
```