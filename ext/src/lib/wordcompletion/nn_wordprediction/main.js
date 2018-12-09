import * as tf from '@tensorflow/tfjs';
import indices_char from './indices_char';
import char_indices from './char_indices';
import 'babel-polyfill';

const INPUT_LENGTH = 40;
const CHARS_TO_GENERATE = 30;
const DIVERSITY = 0.5;

/**
 * Main application to start on window load
 */
class Main {
  /**
   * Constructor creates and initializes the variables needed for
   * the application
   */
  constructor() {
    this.ready = false;
    tf.loadModel('https://raw.githubusercontent.com/Khayyon1/TabX/nn-word/ext/src/lib/nn_wordprediction/lstm/model.json').then((model) => {
      this.model = model;
      this.ready = true;
    });
  }

  /**
   * Predicts next character from given text and updates UI accordingly.
   * This is the main tfjs loop.
   */
  predict(seed) {
    if (!this.ready) return [];
    this.ready = false;
    const divs = [0.3, 0.6, 0.9, 1.2];
    const result = [];
    return new Promise(resolve => {
      divs.forEach((diversity) => {
        this.generateTextHelper(seed, diversity).then((pred) => {
          result.push(pred);
          if (result.length == divs.length) {
            this.ready = true;
            resolve(result);
          }
        });
      });
    })
  }

  async generateTextHelper(seed, diversity){
    var spaces = 0;
    let generated = seed;
    let result = "";
    while (spaces < 2) {
      const indexTensor = tf.tidy(() => {
        const input = this.convert(generated);
        const prediction = this.model.predict(input).squeeze();
        return this.sample(prediction, diversity);
      })
      const index = await indexTensor.data();
      indexTensor.dispose();
      const new_char = indices_char[index];
      generated += new_char;
      if (new_char == " ") spaces += 1;
      if (spaces == 1) result += new_char;
    }
    result = result.substring(1);
    return result
  }

  /**
   * Randomly samples next character weighted by model prediction.
   */
  sample(prediction, divers) {
    return tf.tidy(() => {
      prediction = prediction.log();
      const diversity = tf.scalar(divers);
      prediction = prediction.div(diversity);
      prediction = prediction.exp();
      prediction = prediction.div(prediction.sum());
      prediction = prediction.mul(tf.randomUniform(prediction.shape));
      return prediction.argMax();
    });
  }

  /**
   * Converts sentence to Tensor for feeding into model.
   */
  convert(sentence) {
    sentence = sentence.toLowerCase();
    sentence = sentence.split('').filter(x => x in char_indices).join('');
    if (sentence.length < INPUT_LENGTH) {
      sentence = sentence.padStart(INPUT_LENGTH);
    } else if (sentence.length > INPUT_LENGTH) {
      sentence = sentence.substring(sentence.length - INPUT_LENGTH);
    }
    const buffer = tf.buffer([1, INPUT_LENGTH, Object.keys(indices_char).length]);
    for (let i = 0; i < INPUT_LENGTH; i++) {
      let char = sentence.charAt(i)
      buffer.set(1, 0, i, char_indices[char]);
    }
    const input = buffer.toTensor();
    return input;
  }
}


let nn = new Main();
module.exports = nn;