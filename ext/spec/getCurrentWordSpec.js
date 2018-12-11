const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');
const mock = require('../src/lib/mock/wordcomplete_mock');

const doc = (new JSDOM(``)).window.document;
const tabx = new TabX(mock, undefined, undefined, document=doc);

function getCurrentWordTestSuite()
{
   var inputId = "mockInput"

    beforeEach(function()
    {
      var field = doc.createElement("input");
      field.id = inputId;
      doc.body.appendChild(field);
      field.focus();
   });

    afterEach(function()
    {
      var input = doc.getElementById(inputId);
      input.parentNode.removeChild(input);
    });

   it("should return nothing when caret is at beginning of input",
   function()
   {
       var testwords = "hello world"
       doc.activeElement.value =  testwords
       doc.activeElement.selectionStart = 0
       expect(tabx.getCurrentWord(doc.activeElement)).toEqual("");
   });

   it("should return the leftmost word when caret at end of input",
   function()
   {
       var testwords = "hello world"
       doc.activeElement.value =  testwords
       doc.activeElement.selectionStart = testwords.length;
       expect(tabx.getCurrentWord(doc.activeElement)).toEqual("world");
   });

   it("should capture text before the caret, delimited by space ",
   function()
   {
       var testwords = "hello worlds"
       doc.activeElement.value = testwords
       doc.activeElement.selectionStart = "hello".length;
       expect(tabx.getCurrentWord(doc.activeElement)).toEqual("hello");
   });

   it("should capture partial word text before the caret, delimited by space",
   function ()
   {
       var testwords = "hello worlds"
       doc.activeElement.value = testwords
       doc.activeElement.selectionStart = 3
       expect(tabx.getCurrentWord(doc.activeElement)).toEqual("hel");
   })

    it('should return the word that is before a space, which is '
    + 'before the caret',
    function ()
    {
        var testwords = "hello "
        doc.activeElement.value = testwords
        doc.activeElement.selectionStart = testwords.length
        expect(tabx.getCurrentWord(doc.activeElement)).toEqual("hello");
    });
}

describe("Get Current Word", getCurrentWordTestSuite);
