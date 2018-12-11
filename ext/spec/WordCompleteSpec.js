/*
* This is the file which will call our java script file that need to be tested.
* Each describe block is equivalent to one test case
*
*/
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');

const mock = require('../src/lib/mock/wordcomplete_mock');

const doc = (new JSDOM(``)).window.document;
const tabx = new TabX(mock, undefined, undefined, document=doc);

describe('Word Complete', function()
{
    var inputId = "mockInput"

    beforeEach(function(){
      var field = doc.createElement("input");
      field.id = inputId;
      doc.body.appendChild(field);
      field.focus();
   });

    afterEach(function(){
      var input = doc.getElementById(inputId);
      input.parentNode.removeChild(input);
    });

    it("word should appear in active input field", function () {
        var testword = "hello"
        tabx.wordCompletion(doc.activeElement, testword)
        expect(doc.activeElement.value.includes(testword)).toBe(true)
    });

    it("input field value should include words that come before the "
     + "inserted word",
    function()
    {
      var teststring = "Hello wo";
      doc.activeElement.value = teststring;
      doc.activeElement.selectionStart = teststring.length;
      tabx.wordCompletion(doc.activeElement, "world");

      expect(doc.activeElement.value).toEqual("Hello world");
    });


     it("input field value should include words that come after the"
      + "inserted word",
     function()
     {
          var teststring = "He world";
          doc.activeElement.value = teststring;
          doc.activeElement.selectionStart = 2;
          tabx.wordCompletion(doc.activeElement, "Hello");

          expect(doc.activeElement.value).toEqual("Hello world");
     });

     it("input field value should include words that come before "
      + "and after the inserted word",
     function()
     {
          var teststring = "Hello wo Hello";
          doc.activeElement.value = teststring;
          doc.activeElement.selectionStart = 8;
          tabx.wordCompletion(doc.activeElement, "world");

          expect(doc.activeElement.value).toEqual("Hello world Hello");
     });

    it("should be a space if word completion happens in the middle of a word",
      function(){
      var teststring = "Hello world";
      doc.activeElement.value = teststring;
      doc.activeElement.selectionStart = teststring.length - 2;
      tabx.wordCompletion(doc.activeElement, "world");

      expect(doc.activeElement.value).toEqual("Hello world ld");
   });
});
