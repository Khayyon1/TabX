import sys
import markovify

def predictNextWord(word):
    with open("poeTrain.txt") as f:
        text = f.read()
    text_model = markovify.Text(text)
    predictions = []
    iter = 0;
    while (len(predictions) < 3 and iter < 50):
        prediction = text_model.make_sentence_with_start(word, strict=False, max_words=10).split()[1]
        if (prediction not in predictions):
            predictions.append(prediction)
        iter += 1
    return predictions


print(predictNextWord(sys.argv[1]))
sys.stdout.flush()
