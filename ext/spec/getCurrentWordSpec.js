const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');

const mock = require('../src/lib/mock/wordcomplete_mock');

const document = (new JSDOM(``)).window.document;
const tabx = new TabX(mock, undefined, document);

function getCurrentWordTestSuite()
{
   var inputId = "mockInput"

    beforeEach(function()
    {
      var field = document.createElement("input");
      field.id = inputId;
      document.body.appendChild(field);
      field.focus();
   });

    afterEach(function()
    {
      var input = document.getElementById(inputId);
      input.parentNode.removeChild(input);
    });

   it("should return nothing when caret is at beginning of input",
   function()
   {
       var testwords = "hello world"
       document.activeElement.value =  testwords
       document.activeElement.selectionStart = 0
       expect(tabx.getCurrentWord(document.activeElement)).toEqual("");
   });

   it("should return the leftmost word when caret at end of input",
   function()
   {
       var testwords = "hello world"
       document.activeElement.value =  testwords
       document.activeElement.selectionStart = testwords.length;
       expect(tabx.getCurrentWord(document.activeElement)).toEqual("world");
   });

   it("should capture text before the caret, delimited by space ",
   function()
   {
       var testwords = "hello worlds"
       document.activeElement.value = testwords
       document.activeElement.selectionStart = "hello".length;
       expect(tabx.getCurrentWord(document.activeElement)).toEqual("hello");
   });

   it("should capture partial word text before the caret, delimited by space",
   function ()
   {
       var testwords = "hello worlds"
       document.activeElement.value = testwords
       document.activeElement.selectionStart = 3
       expect(tabx.getCurrentWord(document.activeElement)).toEqual("hel");
   })

    it('should return the word that is before a space, which is '
    + 'before the caret',
    function ()
    {
        var testwords = "hello "
        document.activeElement.value = testwords
        document.activeElement.selectionStart = testwords.length
        expect(tabx.getCurrentWord(document.activeElement)).toEqual("hello");
    });
}

describe("Get Current Word", getCurrentWordTestSuite);
