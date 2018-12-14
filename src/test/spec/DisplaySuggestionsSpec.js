const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX = require('../src/tabx');
const mock =  require('../src/lib/mock/wordcomplete_mock')

const doc = (new JSDOM(``)).window.document;
var tabx = null;

const async_it = require('./helpers/util/asyncit');

var display = require('../assets/js/viewstrats/tablestrat');
display = new display(doc);

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

      tabx = new TabX(mock, undefined, display, document=doc);
      tabx.registerListeners();
   });

    afterEach(() => tabx.displayStrategy.tearDown());

    async_it('should display suggestions if there is an active element, ' +
        'an editable text field with non-empty display', () => {
        input("hello");
        spyOn(tabx, "getSuggestions").and.returnValue(new Promise((resolve, reject) => resolve(["hi", "bye", "good"])));
            return tabx.displaySuggestions();
    }, (results) => expect(doc.getElementById(display.ID)).not.toBeNull());

    async_it('should not display if there is no active element', () => {
        var str = "hi";
        input(str);
        doc.activeElement.blur();
        spyOn(tabx, "getSuggestions").and.returnValue(["here"])
        return tabx.displaySuggestions();
    }, (results) => expect(doc.getElementById(display.ID)).toBeNull());

    async_it('should tear down display if active element is unfocused', () =>
    {
       var str = "hi";
       input(str);
       spyOn(tabx, "getSuggestions").and.returnValue(["here"]);
       return tabx.displaySuggestions();}, (results) => {
        doc.activeElement.blur();
        expect(doc.getElementById(display.ID)).toBeNull();});

}

describe("DisplayTable", DisplayTableSuite);
