const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const TabX =  require('../src/tabx');

const mock = require('../src/lib/mock/wordcomplete_mock');

const doc = (new JSDOM(``)).window.document;
const tabx = new TabX(mock, undefined, undefined, document=doc);

describe("Get Suggestions", function()
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

    it("should return suggestions for common prefix", done => {
        // Arrange
        let suggestions = [];
        suggestions = tabx.getSuggestions("he");
        suggestions.then((suggestions) => {
            // Assert
            expect(suggestions.length > 0).toBe(true);
            done();
        });
    });

    it('should not return suggestions for for empty string', done => {
        let suggestions = [];
        suggestions = tabx.getSuggestions("");
        suggestions.then((suggestions) => {
            // Assert
            expect(suggestions.length).toEqual(0);
            done();
        });
    });

    it('should not return suggestions for non-alphabetic word', done => {
        let suggestions = [];
        suggestions = tabx.getSuggestions("BigK99");
        suggestions.then((suggestions) => {
            // Assert
            expect(suggestions.length).toEqual(0);
            done();
        });
    })
});