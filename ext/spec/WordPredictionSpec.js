const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');
const mock = require('../src/lib/mock/nextword_mock');
const document = (new JSDOM('')).window.document;
const tabx = new TabX(undefined, mock, document);

function suggestionTestSuite()
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

   it("should return suggestions for the next word", function()
   {
      fail();
   });
}
describe("Get Next Word Suggestions", suggestionTestSuite)