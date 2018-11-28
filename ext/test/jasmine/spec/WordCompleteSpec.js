/*
* This is the file which will call our java script file that need to be tested.
* Each describe block is equivalent to one test case
*
*/

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

describe("Get Suggestions", suggestionsTestSuite);


function getCurrentWordTestSuite()
{
   beforeEach(function(){});
   afterEach(function(){});

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

describe("Get Current Word", getCurrentWordTestSuite);

function wordCompleteTestSuite()
{
    var inputId = "mockInput"

    beforeEach(function(){
      var field = document.createElement("input");
      field.id = inputId;
      document.body.appendChild(field);
      field.focus();
   });

    afterEach(function(){
      input = document.getElementById(inputId);
      input.parentNode.removeChild(input);
    });

    it("word should appear in active input field", function () {
        var testword = "hello"
        wordCompletion(document.activeElement, testword)
        expect(document.activeElement.value.includes(testword)).toBe(true)
    });

    it("input field value should include words that come before the inserted word",
    function()
    {
      var teststring = "Hello wo";
      document.activeElement.value = teststring;
      document.activeElement.selectionStart = teststring.length;
      wordCompletion(document.activeElement, "world");

      expect(document.activeElement.value).toEqual("Hello world");
    });


     it("input field value should include words that come after the inserted word",
     function()
     {
          var teststring = "He world";
          document.activeElement.value = teststring;
          document.activeElement.selectionStart = 2;
          wordCompletion(document.activeElement, "Hello");

          expect(document.activeElement.value).toEqual("Hello world");
     });

     it("input field value should include words that come before and after the inserted word",
     function()
     {
          var teststring = "Hello wo Hello";
          document.activeElement.value = teststring;
          document.activeElement.selectionStart = 8;
          wordCompletion(document.activeElement, "world");

          expect(document.activeElement.value).toEqual("Hello world Hello");
     });

    it("should be a space if word completion happens in the middle of a word",
      function(){
      var teststring = "Hello world";
      document.activeElement.value = teststring;
      document.activeElement.selectionStart = teststring.length - 2;
      wordCompletion(document.activeElement, "world");

      expect(document.activeElement.value).toEqual("Hello world ld");
   });
}

describe('Word Complete', wordCompleteTestSuite);
