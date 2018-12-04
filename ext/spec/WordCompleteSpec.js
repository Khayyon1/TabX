/*
* This is the file which will call our java script file that need to be tested.
* Each describe block is equivalent to one test case
*
*/
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');

const mock = require('../src/lib/mock/wordcomplete_mock');

const document = (new JSDOM(``)).window.document;
const tabx = new TabX(mock, undefined, document);

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
      var input = document.getElementById(inputId);
      input.parentNode.removeChild(input);
    });

    it("should return suggestions for common word", function()
   {
      expect(tabx.getSuggestions("the").length > 0).toBe(true);
   });

   it('should not return suggestions for for empty string', function () {
       expect(tabx.getSuggestions("").length).toEqual(0);
   });

   it('should not return suggestions for non-alphabetic word', function () {
        expect(tabx.getSuggestions("BigK99").length).toEqual(0);
   })
}

describe("Get Suggestions", suggestionsTestSuite);




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
      var input = document.getElementById(inputId);
      input.parentNode.removeChild(input);
    });

    it("word should appear in active input field", function () {
        var testword = "hello"
        tabx.wordCompletion(document.activeElement, testword)
        expect(document.activeElement.value.includes(testword)).toBe(true)
    });

    it("input field value should include words that come before the inserted word",
    function()
    {
      var teststring = "Hello wo";
      document.activeElement.value = teststring;
      document.activeElement.selectionStart = teststring.length;
      tabx.wordCompletion(document.activeElement, "world");

      expect(document.activeElement.value).toEqual("Hello world");
    });


     it("input field value should include words that come after the inserted word",
     function()
     {
          var teststring = "He world";
          document.activeElement.value = teststring;
          document.activeElement.selectionStart = 2;
          tabx.wordCompletion(document.activeElement, "Hello");

          expect(document.activeElement.value).toEqual("Hello world");
     });

     it("input field value should include words that come before and after the inserted word",
     function()
     {
          var teststring = "Hello wo Hello";
          document.activeElement.value = teststring;
          document.activeElement.selectionStart = 8;
          tabx.wordCompletion(document.activeElement, "world");

          expect(document.activeElement.value).toEqual("Hello world Hello");
     });

    it("should be a space if word completion happens in the middle of a word",
      function(){
      var teststring = "Hello world";
      document.activeElement.value = teststring;
      document.activeElement.selectionStart = teststring.length - 2;
      tabx.wordCompletion(document.activeElement, "world");

      expect(document.activeElement.value).toEqual("Hello world ld");
   });
}

describe('Word Complete', wordCompleteTestSuite);
