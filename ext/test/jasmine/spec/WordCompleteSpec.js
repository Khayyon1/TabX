/*
* This is the file which will call our java script file that need to be tested.
* Each describe block is equivalent to one test case
*
*/

describe("Get Suggestions", suggestionsTestSuite);
function suggestionsTestSuite()
{
   it("should return non-empty suggestions list", function()
   {
      expect(getSuggestions("hello").length > 0).toBe(true);
   });

   it("shoud return an empty suggestions list for a nonsense word", function(){
      expect(getSuggestions("fjuernf").length == 0).toBe(true);
   });

   it('should return empty suggestions list for empty string', function () {
       expect(getSuggestions("").length == 0).toBe(true);
   });

   it('should not add populate input field if it is empty',function () {
       expect(getSuggestions("").length == 0).toBe(true);
   });
}

describe("Get Current Word", getCurrentWordTestSuite);
function getCurrentWordTestSuite()
{
    it("should return all the words in the text field if caret is at end of input", function()
   {
      expect(getCurrentWord(document.activeElement) == document.activeElement).toBe(true);
   });
    it("If user clicks in the middle of a word, the current should not equal the whole text field", function()
   {
      expect(getCurrentWord(document.activeElement) == document.activeElement).toBe(false);
   });
    it("if caret is at the leftmost position of the input field then current word should not exist", function () {
       expect(getCurrentWord(document.activeElement) == "").toBe(true);
    });
}

describe('Word Complete', wordCompleteTestSuite);
function wordCompleteTestSuite()
{
    it("word should appear in active input field", function () {
        var testword = "hi"
        wordCompletion(document.activeElement, testword)
        expect(document.activeElement.value.includes(testword)).toBe(true)
    });
}
