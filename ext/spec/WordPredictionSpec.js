const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');
const mock = require('../src/lib/mock/nextword_mock');
const doc = (new JSDOM('')).window.document;
const tabx = new TabX(undefined, mock, undefined, document=doc);

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


    async_it('should not return results if there is no space before the caret',
        () => {
            input('Hi There');
            return tabx.getNextWordSuggestion(getInput());
        },
        (result) => expect(result.length == 0).toBe(true));

    async_it('should return results if current word is valid'
        + ' and there is a space before the caret', () => {
            input('Hello, there are 3 people here ');
            return tabx.getNextWordSuggestion(getInput())
        },
        (result) => expect(result.length > 0).toBe(true));
});

describe("Valid input", function()
{
   async_it("should not return suggestions if caret is at position 0", () => {
       //var current_Active_Element = getInput() = 'hello ';
       set_caret(0);
       return tabx.getNextWordSuggestion("hi ");
   }, (result) => expect(result.length).toEqual(0));

   async_it("should not return results if current word has a number", () => {
       input("BigK99");
       return tabx.getNextWordSuggestion(getInput());
   }, (result) => expect(result.length).toEqual(0));
});


function getInput(){
    return doc.activeElement.value;
}

function async_it(msg, func, expec)
{
    it(msg, function(done)
    {
        let result = func();
        result.then((result) => expec(result));
        done();
    });
}