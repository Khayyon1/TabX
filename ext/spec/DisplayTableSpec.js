const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX = require('../src/tabx');
const mock =  require('../src/lib/mock/wordcomplete_mock')

const document = (new JSDOM(``)).window.document;
var tabx = null;

function input(str)
{
    document.activeElement.value = str;
    set_caret(str.length)
}

function set_caret(caret_position)
{
    document.activeElement.selectionStart = caret_position
}

function DisplayTableSuite()
{
      var inputId = "mockInput";

    beforeEach(function()
    {
      var field = document.createElement("input");
      field.id = inputId;
      field.type = "text"
      document.body.appendChild(field);
      field.focus();

      tabx = new TabX(mock, undefined, document);

   });

    afterEach(function()
    {
      var input = document.getElementById(inputId);
      input.parentNode.removeChild(input);
      var current_table = document.getElementById(tabx.SUGGESTIONS_TABLE);
      if(current_table != null)
      {
            document.body.removeChild(current_table);
      }
    });

    it('should provide Suggestions if there is an active element, an editable text field with non-empty table', function()
    {
        var str = "hello";
        input(str);
        spyOn(tabx, "getSuggestions").and.returnValue(["hi", "bye","good"]);
        tabx.displaySuggestions(document.activeElement);
        expect(document.getElementById(tabx.SUGGESTIONS_TABLE)).not.toBe(null);

    });

    it('should not display if there is no active element', function()
    {
        var str = "hi";
        input(str);
        document.activeElement.blur();
        spyOn(tabx, "getSuggestions").and.returnValue(["here"])
        tabx.displaySuggestions(document.activeElement);
        expect(document.getElementById(tabx.SUGGESTIONS_TABLE)).toBe(null);
    });

    it('should not display if active element is unfocused', function()
    {
       var str = "hi";
       input(str);
       spyOn(tabx, "getSuggestions").and.returnValue(["here"])
       tabx.displaySuggestions(document.activeElement);
       document.activeElement.blur();
       expect(document.getElementById(tabx.SUGGESTIONS_TABLE)).toBe(null);
    });
}
describe("DisplayTable", DisplayTableSuite);
