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

describe('Word Complete', function()
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

    it("input field value should include words that come before the "
     + "inserted word",
    function()
    {
      var teststring = "Hello wo";
      document.activeElement.value = teststring;
      document.activeElement.selectionStart = teststring.length;
      tabx.wordCompletion(document.activeElement, "world");

      expect(document.activeElement.value).toEqual("Hello world");
    });


     it("input field value should include words that come after the"
      + "inserted word",
     function()
     {
          var teststring = "He world";
          document.activeElement.value = teststring;
          document.activeElement.selectionStart = 2;
          tabx.wordCompletion(document.activeElement, "Hello");

          expect(document.activeElement.value).toEqual("Hello world");
     });

     it("input field value should include words that come before "
      + "and after the inserted word",
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
});
