const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');
const mock = require('../src/lib/mock/nextword_mock');
const document = (new JSDOM('')).window.document;
const tabx = new TabX(undefined, mock, document);

function set_caret(caret_position)
{
    document.activeElement.selectionStart = caret_position
}

function input(str)
{
    document.activeElement.value = str;
    set_caret(str.length)
}

describe("Get Next Word Suggestions", function()
{
    var inputId = "mockInput";

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


   it('should not return results if there is no space before the caret',
   function()
   {
       input('Hi There');
       expect(tabx.getNextWordSuggestion(getInput()).length == 0).toBe(true)
   });

    it('should return results if current word is valid'
        + 'and there is a space before the caret', function()
    {
       var testInput = 'Hello, there are 3 people here ';
       input(testInput);
       expect(tabx.getNextWordSuggestion(getInput()).length > 0).toBe(true);
    });
});


describe("Valid input", function()
{
   it("should not return suggestions if caret is at position 0", function()
   {
      //var current_Active_Element = getInput() = 'hello ';
       set_caret(0);
      expect(tabx.getNextWordSuggestion("hi ").length == 0).toBe(true);
   });

   it("should not return results if current word has a number", function ()
   {
     input("BigK99")
     expect(tabx.getNextWordSuggestion(getInput()).length == 0).toBe(true);
   });
});


function getInput(){
    return document.activeElement.value;
}
