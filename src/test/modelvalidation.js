const triemodel = require("../src/lib/wordcompletion/triecomplete/trieModelFinal.js");
const markovmodel = require("../src/lib/wordprediction/markov/word-prediction");
const fs = require('fs');

function removeDuplicates(arr)
{
   let wordSet = new Set();
   return arr.filter((word) =>
   {
      if (!wordSet.has(word) && word.length != 0)
      {
         wordSet.add(word);
         return true;
      }

      return false;});
}

function validate(str, threshold)
{
   let cleaned = str.replace(/[^a-zA-Z\s'-]/g, "");
   let split = removeDuplicates(cleaned.split(" "));
   let correct = 0;
   let rounds = 0;
   for(let word of split)
   {
      for(let i = 0; i < word.length; i++)
      {
         rounds += 1;
         let sub = word.substring(0, i);
         predictions = triemodel.predictCurrentWord(sub);
         if(sub.length <= word.length - threshold
            && predictions.includes(word))
         {
            console.log("FOUND " + "\"" + word + "\"" + " from " + "\"" + sub + "\"")
            correct += 1;
            break;
         }
      }
   }

   let totalRounds = split.reduce((acc, cur) => { return acc + cur.length; }, 0);
   console.log("Correct: " + correct + "/" + split.length);
   console.log("Rounds: " + rounds + "/" + totalRounds);
}

function validateNextWord(str)
{

}

let teststr = "The UHLCS, maintained by the University of Helsinki, was founded in late 1980. At present, the UHLCS contains computer corpora of more than 50 languages, including samples of minority languages and extensive corpora representing different text types. In 2000, the corpora of the Uralic, Turkic, Tungusic, Mongolic, Chukotko-Kamchatkan, Iranian and North-East Caucasian languages were edited for public use with the financial support of the Max Planck Institute for Evolutionary Anthropology, Leipzig. In summer 2003, metadata descriptions for the corpora were prepared with the financial support of the ECHO project (European Cultural Inheritance Online). There are also tools at the UHLCS which can be used in analyzing the corpora. The use of most of the corpora is restricted for research and teaching."

validate(teststr, 3);
