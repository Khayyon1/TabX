const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');
const mock = require('../src/lib/mock/nextword_mock');
const doc = (new JSDOM('')).window.document;
const tabx = new TabX(undefined, mock, undefined, document=doc);
const async_it = require('./helpers/util/asyncit');

function set_caret(caret_position)
{
    doc.activeElement.selectionStart = caret_position
}

function input(str)
{
    doc.activeElement.value = str;
    set_caret(str.length)
}

describe("Get Next Word Suggestions", function() {
    var inputId = "mockInput";

    beforeEach(function () {
        var field = doc.createElement("input");
        field.id = inputId;
        doc.body.appendChild(field);
        field.focus();
    });

    afterEach(function () {
        var input = doc.getElementById(inputId);
        input.parentNode.removeChild(input);
    });

    async_it('should return results if current word is valid'
        + ' there is a space before the caret', () => {
            input('Hello, there are 3 people here ');
            return tabx.getNextWordSuggestion(getInput())
        },
        (result) => expect(result.length > 0).toBe(true));
});

describe("Valid input", function()
{
    var inputId = "mockInput";
    beforeEach(function () {
        var field = doc.createElement("input");
        field.id = inputId;
        doc.body.appendChild(field);
        field.focus();
    });

    afterEach(function () {
        var input = doc.getElementById(inputId);
        input.parentNode.removeChild(input);
    });

    async_it("should not return suggestions if caret is at position 0", () => {
        //var current_Active_Element = getInput() = 'hello ';
        set_caret(0);
        return tabx.getNextWordSuggestion("hi ");
    }, (result) => expect(result.length).toEqual(0));

    async_it("should not return results if current word has a number", () => {
        input("BigK99");
        return tabx.getNextWordSuggestion(getInput());
    }, (result) => expect(result.length).toEqual(0));

    async_it('should not return results if there is a character at the caret\'s position',
        () => {
            input('abcdef ghijk');
            set_caret(7);
            return tabx.getNextWordSuggestion(getInput());
        },
        (result) => expect(result.length == 0).toBe(true));

    async_it('should not return results if there is no space before the caret',
        () => {
            input('ab cdef g');
            return tabx.getNextWordSuggestion(getInput());
        },
        (result) => expect(result.length == 0).toBe(true));
});

function getInput(){
    return doc.activeElement.value;
}
