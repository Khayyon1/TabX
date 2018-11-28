/*
* This is the file which will call our java script file that need to be tested.
* Each describe block is equivalent to one test case
*
*/
function suggestionsTestSuite()
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

    it("should return non-empty suggestions list for common word", function()
   {
      expect(getSuggestions("the").length > 0).toBe(true);
   });

   it("shoud return an empty suggestions list for a nonsense word", function(){
      expect(getSuggestions("fjuernf").length).toEqual(0);
   });

   it('should return empty suggestions list for empty string', function () {
       expect(getSuggestions("").length).toEqual(0);
   });

   it('should not return suggestions for non-alphabetic word', function () {
        expect(getSuggestions("BigK99").length).toEqual(0);
   })
}

describe("Get Suggestions", suggestionsTestSuite);


function getCurrentWordTestSuite()
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

   it("should return nothing when caret is at beginning of input", function()
   {
       var testwords = "hello world"
       document.activeElement.value =  testwords
       document.activeElement.selectionStart = 0
       expect(getCurrentWord(document.activeElement)).toEqual("");
   });

   it("should return the leftmost word when caret at end of input", function()
   {
       var testwords = "hello world"
       document.activeElement.value =  testwords
       expect(getCurrentWord(document.activeElement)).toEqual("world");
   });

   it("should capture whole word text up to caret delimited by space ", function()
   {
       var testwords = "hello worlds"
       document.activeElement.value = testwords
       expect(getCurrentWord(document.activeElement)).toEqual("worlds");
   });

   it("should capture partial word text up to caret delimited by space",function () {
       var testwords = "hello worlds"
       document.activeElement.value = testwords
       document.activeElement.selectionStart = 3
       expect(getCurrentWord(document.activeElement)).toEqual("hel");
   })
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
