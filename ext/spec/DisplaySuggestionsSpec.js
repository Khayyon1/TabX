const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX = require('../src/tabx');
const mock =  require('../src/lib/mock/wordcomplete_mock')

const doc = (new JSDOM(``)).window.document;
var tabx = null;

const async_it = require('./helpers/util/asyncit');

var mock_display = {};
function input(str)
{
    doc.activeElement.value = str;
    set_caret(str.length)
}

function set_caret(caret_position)
{
    doc.activeElement.selectionStart = caret_position
}

function DisplayTableSuite()
{
    let inputId = "mockInput";

    beforeEach(function()
    {
      let field = doc.createElement("input");
      field.id = inputId;
      field.type = "text"
      doc.body.appendChild(field);
      field.focus();

      tabx = new TabX(mock, undefined, undefined, document=doc);
   });

    afterEach(function()
    {
      var input = doc.getElementById(inputId);
      input.parentNode.removeChild(input);
      var current_table = doc.getElementById(tabx.SUGGESTIONS_TABLE);
      if(current_table != null)
      {
            doc.body.removeChild(current_table);
      }
    });

    async_it('should provide suggestions if there is an active element, ' +
        'an editable text field with non-empty table', () => {
        var str = "hello";
        input(str);
        spyOn(tabx, "getSuggestions").and.returnValue(["hi", "bye", "good"]);
        tabx.displaySuggestions();
    }, (results) => expect(doc.getElementById(tabx.SUGGESTIONS_TABLE)).not.toBe(null));

    it('should not display if there is no active element', function()
    {
        var str = "hi";
        input(str);
        doc.activeElement.blur();
        spyOn(tabx, "getSuggestions").and.returnValue(["here"])
        tabx.displaySuggestions(doc.activeElement);
        expect(doc.getElementById(tabx.SUGGESTIONS_TABLE)).toBe(null);
    });

    it('should not display if active element is unfocused', function()
    {
       var str = "hi";
       input(str);
       spyOn(tabx, "getSuggestions").and.returnValue(["here"])
       tabx.displaySuggestions(doc.activeElement);
       doc.activeElement.blur();
       expect(doc.getElementById(tabx.SUGGESTIONS_TABLE)).toBe(null);
    });
}
describe("DisplayTable", DisplayTableSuite);
